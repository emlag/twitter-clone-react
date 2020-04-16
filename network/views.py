import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Post, Follow


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
    # print("all posts for:" + username)
    # print(all_posts)
    all_posts = all_posts.order_by("-timestamp").all()

    return JsonResponse([post.serialize() for post in all_posts], safe=False)


def posts(request):
    # Return posts in reverse chronologial order
    print("in posts/")
    all_posts = Post.objects.all()
    all_posts = all_posts.order_by("-timestamp").all()

    # `/posts?start=${start}&end=${end}`
    page_num = int(request.GET.get("page") or 1)
    p = Paginator(all_posts, 10)
    page_show = p.page(page_num)
    posts_json = [post.serialize() for post in page_show]
    # posts_json.append({"num_pages": p.num_pages})

    return JsonResponse({"posts": posts_json, "num_pages": p.num_pages}, safe=False)


def profreq(request, username):
    print("in profreq/")
    user_found = User.objects.filter(username__exact=username)

    # TODO handle user not found!
    # show the username
    # show number of followers
    # shows number of following
    following = Follow.objects.filter(user__username__exact=username).all()
    followers = Follow.objects.filter(target__username__exact=username).all()

    print(following.count())
    print(followers.count())

    return_info = {
        "user": username,
        "email": user_found[0].email,
        "followers": followers.count(),
        "following": following.count()
    }

    return JsonResponse(return_info, safe=False)

@login_required
def following(request):
    # get users that this guy is following
    follows = Follow.objects.filter(user__exact=request.user).all()
    following_users = [fuser.target for fuser in follows]

    # get get posts for each of those users
    all_posts = Post.objects.none()
    for fuser in following_users:
        fuser_posts = Post.objects.filter(author__exact=fuser).all()
        all_posts = all_posts | fuser_posts

    # order_by those posts
    all_posts = all_posts.order_by("-timestamp").all()
    # serialize all those posts
    # send them back

    return JsonResponse([post.serialize() for post in all_posts], safe=False)


@csrf_exempt
@login_required
def compose(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    data = json.loads(request.body)
    body = data.get("body", "")
    author = request.user

    post = Post(author=author, body=body)
    post.save()

    return JsonResponse({"message": "Post saved successfully."}, status=201)


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
