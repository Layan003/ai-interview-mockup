from django.db import models
from django.contrib.auth.models import User


class Interview(models.Model):
    job_position = models.CharField(max_length=100)
    job_description = models.CharField(max_length=250)
    job_experience = models.PositiveIntegerField(default=0)
    json_response = models.TextField(max_length=10000, blank=True, null=True)
    user = models.ForeignKey(User, related_name='interviews', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=250)
    user_answer = models.CharField(null=True, blank=True, max_length=600)
    feedback = models.CharField(null=True, blank=True, max_length=600)
    rating = models.IntegerField(null=True, blank=True)

