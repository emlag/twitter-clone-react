from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_sent", null=True)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
            "email": self.author.email,
            "likes_count": self.likes_count
        }


class Follow(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    target = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "target": self.target.username
        }

    class Meta:
        unique_together = ('user', 'target')


class Like(models.Model):
    user = models.ForeignKey(User, related_name='liker', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='post', on_delete=models.CASCADE)
