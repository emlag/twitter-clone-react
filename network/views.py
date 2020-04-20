import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Post, Follow, Like


def index(request):
    """
        As a single page app, many links and routes will default to index.
        This will render the single html used, outside of the login and register pages.
    """
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def user_posts(request, username):
    """
        Shows posts for a particular user, if that user exists
        follows the url, /posts/username
        This is used in the profile view.

        Args:
            request (HttpRequest): contains metadata about the page request
            username (string): the username for the author of the posts being requested

        Returns:
            an JsonResponse object with the calculated options
    """

    all_posts = Post.objects.filter(author__username__exact=username)
    all_posts = all_posts.order_by("-timestamp").all()

    to_show = paginate(request, all_posts)

    return JsonResponse(to_show, safe=False)


def posts(request):
    """
        Used to fetch all posts in the database

        Args:
            request (HttpRequest): contains metadata about the page request

        Returns:
            an JsonResponse object with the calculated options
    """
    all_posts = Post.objects.all()
    all_posts = all_posts.order_by("-timestamp").all()

    to_show = paginate(request, all_posts)

    return JsonResponse(to_show, safe=False)


def paginate(request, posts_to_show):
    """
        Creates pages for the QuerySet requested, the user is expected to
        use the format `/posts?page=${pageNum}` to request a specific page.

        Args:
            request (HttpRequest): contains metadata about the page request
            posts_to_show (QuerySet): this is a Query set calculated by the calling function

        Returns:
            an JsonResponse object with the calculated options
    """

    page_num = int(request.GET.get("page") or 1)
    p = Paginator(posts_to_show, 10)
    page_show = p.page(page_num)

    to_show = []

    # serialize each post and decide whether the current user likes that post
    for post in page_show:
        ser = post.serialize()

        if request.user.is_authenticated:
            try:
                like = Like.objects.get(user=request.user, post=post)
            except Like.DoesNotExist:
                like = None
        else:
            like = None

        ser["isLiked"] = like is not None
        to_show.append(ser)

    # return the final json with serialized posts and information for UI pagination
    final_json = {"posts": to_show, "num_pages": p.num_pages, "curr_user": request.user.username}
    return final_json


def update_post(request, post_id):
    """
        Currently used to update a post's text or likes

        Args:
            request (HttpRequest): contains metadata about the page request
            post_id (integer): the id of the post to be updated

        Returns:
            an JsonResponse which explains success or failure
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({
            "error": "post id is invalid"
        }, status=400)

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "must be signed in to update or like"
        }, status=400)

    if request.method == "PUT":
        data = json.loads(request.body)

        # update by creating a new like or unlike by deleting existing like
        if data.get("create_like") is not None:
            if data["create_like"]:
                new_like = Like(user=request.user, post=post)
                new_like.save()
            else:
                Like.objects.get(user=request.user, post=post).delete()

        # update post's text
        if data.get("new_text") is not None:
            if request.user != post.author:  # prevent others from changing tweet text
                return JsonResponse({
                    "error": "invalid permission to update this tweet"
                }, status=400)
            else:
                post.body = data["new_text"]

        likes = Like.objects.filter(post=post).count()
        post.likes_count = likes
        post.save()
        return JsonResponse({
            "success": "post updated"
        }, safe=False)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)


def profreq(request, username):
    """
        Returns information about a user. This is used to display a user's profile.

        Args:
            request (HttpRequest): contains metadata about the page request
            username (string): the username to query info for

        Returns:
            an JsonResponse object user's info
    """
    try:
        user_found = User.objects.get(username__exact=username)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "user not found"
        }, status=400)

    # how many followers and followings are found?
    is_following = Follow.objects.filter(user__username__exact=username).all()
    followers = Follow.objects.filter(target__username__exact=username).all()

    # is the current logged in user following the user whose profile we're viewing?
    if request.user.is_authenticated:
        try:
            fol = Follow.objects.get(user=request.user, target=user_found)
        except Follow.DoesNotExist:
            fol = None
    else:
        fol = None

    # we can't follow ourselves
    if request.user.is_authenticated:
        show = request.user.username != username
    else:
        show = False

    return_info = {
        "user": username,
        "email": user_found.email,
        "followers": followers.count(),
        "following": is_following.count(),
        "isFollowing": fol is not None,
        "showFollow": show
    }

    return JsonResponse(return_info, safe=False)


@login_required
def follow(request, target_user):
    """
        User to create a follow between two users.

        Args:
            request (HttpRequest): contains metadata about the page request
            target_user (string): the username that the current logged in user will follow

        Returns:
            an JsonResponse containing success or failure message
    """
    try:
        target = User.objects.get(username__exact=target_user)
        if request.user.username == target_user:
            return JsonResponse({
                "error": "Can't follow yourself"
            }, status=400)
    except User.DoesNotExist:
        target = None

    if target is not None:
        if request.method == "PUT":
            try:
                is_follow = Follow.objects.get(user=request.user, target=target)  # follow exists
            except Follow.DoesNotExist:
                is_follow = None

            if is_follow is None:  # we can create the follow if it doesn't exist
                fol = Follow(user=request.user, target=target)
                fol.save()
                return JsonResponse({
                    "isFollowing": True
                }, safe=False)
            else:
                is_follow.delete()  # unFollow
                return JsonResponse({
                    "isFollowing": False
                }, safe=False)
        else:
            return JsonResponse({
                "error": "PUT request required."
            }, status=400)
    else:
        return JsonResponse({
            "error": "target user not found"
        }, status=400)


@login_required
def following(request):
    """
        Returns all of the posts of the users that the logged in user is following

        Args:
            request (HttpRequest): contains metadata about the page request

        Returns:
            an JsonResponse object user's info
    """
    # get users that logged in user is following
    if request.user.is_authenticated:
        follows = Follow.objects.filter(user__exact=request.user).all()
    else:
        return JsonResponse({
            "error": "user not found"
        }, status=400)

    following_users = [fuser.target for fuser in follows]

    # get get posts for each of those users
    all_posts = Post.objects.none()
    for fuser in following_users:
        fuser_posts = Post.objects.filter(author__exact=fuser).all()
        all_posts = all_posts | fuser_posts

    # order_by those posts
    all_posts = all_posts.order_by("-timestamp").all()
    to_show = paginate(request, all_posts)

    return JsonResponse(to_show, safe=False)


@login_required
def compose(request):
    """
        Creates a new post.

        Args:
            request (HttpRequest): contains metadata about the page request

        Returns:
            an JsonResponse with error status or post's id on success
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    data = json.loads(request.body)
    body = data.get("body", "")
    author = request.user

    post = Post(author=author, body=body)
    post.save()

    return JsonResponse({"newPostId": post.id}, safe=False)


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
