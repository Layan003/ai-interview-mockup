from rest_framework import serializers
from .models import Interview, Question

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['id', 'job_position', 'job_description', 'job_experience', 'created_at', 'json_response', 'user']


class QuestionSerializer(serializers.ModelSerializer):
    interview = InterviewSerializer()
    class Meta:
        model = Question
        fields = ['interview','id', 'text', 'user_answer', 'feedback', 'rating']
