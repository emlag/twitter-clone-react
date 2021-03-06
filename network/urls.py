from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API for posts, follows and likes
    path("compose", views.compose, name="compose"),
    path("following_posts", views.following, name="following"),
    path("posts", views.posts, name="posts"),
    path("posts/<int:post_id>", views.update_post, name="update_post"),
    path("posts/<str:username>", views.user_posts, name="user_posts"),
    path("profreq/<str:username>", views.profreq, name="profile_request"),
    path("follow/<str:target_user>", views.follow, name="follow"),

    # match all other pages, user by react router
    re_path(r'^$', views.index),
    re_path(r'^(?:.*)/?$', views.index)
]
