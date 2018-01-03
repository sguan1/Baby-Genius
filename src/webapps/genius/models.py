# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models

# Create your models here.
from django.utils.translation import ugettext_lazy


class Profile(models.Model):
    user = models.OneToOneField(User, primary_key=True)
    age = models.IntegerField(validators=[MaxValueValidator(100), MinValueValidator(0)])
    bio = models.CharField(max_length=420, default="", blank=True)
    picture = models.ImageField(upload_to="profile-photos", blank=True)


def operationValidator(value):
    if value != '+' and value != '-':
        raise ValidationError(
            ugettext_lazy('%(value)s is not a valid operation'),
            params={'value': value},
        )


def choiceValidator(value):
    if value != 'A' and value != 'B' and value != 'C' and value != 'D':
        raise ValidationError(
            ugettext_lazy('%(value)s is not a valid choice'),
            params={'value': value},
        )


class Question(models.Model):
    id = models.IntegerField(primary_key=True)
    difficulty = models.CharField(max_length=10)
    number1 = models.IntegerField(validators=[MaxValueValidator(10), MinValueValidator(0)])
    operation = models.CharField(validators=[operationValidator], max_length=1)
    number2 = models.IntegerField(validators=[MaxValueValidator(10), MinValueValidator(0)])
    choiceA = models.IntegerField()
    choiceB = models.IntegerField()
    choiceC = models.IntegerField()
    choiceD = models.IntegerField()
    answer = models.CharField(validators=[choiceValidator], max_length=1)


class AddSubstractionScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.TimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    score = models.IntegerField()



class mathGame(models.Model):
    game_id = models.AutoField(primary_key=True)
    questions = models.ManyToManyField(Question)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.TimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    score = models.IntegerField(default=0)


class Book(models.Model):
    title = models.CharField(max_length=420, default="")
    description = models.CharField(max_length=500, default="", blank=True)
    cover = models.ImageField(upload_to="cover-photos", blank=True, null=True)
    level = models.IntegerField(validators=[MaxValueValidator(100), MinValueValidator(0)])
    author = models.CharField(max_length=420, default="", blank=True)
    document = models.FileField(upload_to='documents')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, blank=True)


class ImageMatchingScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.TimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    score = models.IntegerField()

class Image(models.Model):
    name = models.CharField(max_length=20)
    picture = models.ImageField(upload_to="image-matching")

class wordSnakeGame(models.Model):
    game_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.TimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    score = models.IntegerField(default=0)


class wordCompleteReview(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    words= models.CharField(max_length=420, default="", blank=True)
    definition=models.CharField(max_length=420, default="", blank=True)