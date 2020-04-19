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
    # all_posts = Post.objects.all()
    all_posts = Post.objects.filter(author__username__exact=username)
    all_posts = all_posts.order_by("-timestamp").all()

    to_show = paginate(request, all_posts)

    return JsonResponse(to_show, safe=False)


def posts(request):
    # Return posts in reverse chronologial order
    all_posts = Post.objects.all()
    all_posts = all_posts.order_by("-timestamp").all()

    to_show = paginate(request, all_posts)

    return JsonResponse(to_show, safe=False)


def paginate(request, posts_to_show):
    # `/posts?page=${pageNum}`
    page_num = int(request.GET.get("page") or 1)
    p = Paginator(posts_to_show, 10)
    page_show = p.page(page_num)

    to_show = []

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

    final_json = {"posts": to_show, "num_pages": p.num_pages, "curr_user": request.user.username}
    return final_json


def update_post(request, post_id):
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

        if data.get("create_like") is not None:
            if data["create_like"]:
                new_like = Like(user=request.user, post=post)
                new_like.save()
            else:
                Like.objects.get(user=request.user, post=post).delete()

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
    try:
        user_found = User.objects.get(username__exact=username)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "user not found"
        }, status=400)

    is_following = Follow.objects.filter(user__username__exact=username).all()
    followers = Follow.objects.filter(target__username__exact=username).all()

    if request.user.is_authenticated:
        try:
            fol = Follow.objects.get(user=request.user, target=user_found)
        except Follow.DoesNotExist:
            fol = None
    else:
        fol = None

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
                is_follow.delete()
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
    # get users that this guy is following
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
