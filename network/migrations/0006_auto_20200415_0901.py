# Generated by Django 3.0.3 on 2020-04-15 09:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_auto_20200414_0833'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='sender',
            new_name='author',
        ),
        migrations.RemoveField(
            model_name='post',
            name='recipient',
        ),
    ]