from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializers import InterviewSerializer, QuestionSerializer
from .models import Interview, Question
from rest_framework.permissions import IsAuthenticated
import json


class InterviewView(generics.ListCreateAPIView): 
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    model = Interview

    def get_queryset(self):
        query = Interview.objects.filter(user=self.request.user)
        return query

    
    def perform_create(self, serializer):
        json_response = serializer.validated_data.get('json_response') 
        interview = serializer.save(user=self.request.user)
        if json_response:
            add_questions(json_response, interview)


def add_questions(json_data, interview):

    if isinstance(json_data, str):
        json_data = json.loads(json_data)

    for item in json_data:
        question = item.get('question')
        q = Question.objects.create(interview=interview, text=question)

class DisplayInterviewDetailsView(APIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        questions = Question.objects.filter(interview=id)[:5]
        interview_details = QuestionSerializer(questions, many=True)
        return Response(interview_details.data, status=status.HTTP_200_OK)
    
    def patch(self, request, id):
        user_answer = request.data.get('user_answer')
        feedback = request.data.get('feedback')
        rating = request.data.get('rating')
        question_id = request.data.get('question_id')

        interview = Interview.objects.get(id=id)
        question = interview.questions.filter(id=question_id).first()

        question.user_answer = user_answer
        question.feedback= feedback
        question.rating = int(rating)
        question.save()
        return Response(status=status.HTTP_200_OK)

