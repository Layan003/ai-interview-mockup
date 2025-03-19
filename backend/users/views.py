from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework import status, generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated



class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
  

