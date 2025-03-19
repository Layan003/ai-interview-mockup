from django.urls import path
from . import views

urlpatterns = [
    path('interview/', views.InterviewView.as_view()),
    path('interview/<int:id>/', views.DisplayInterviewDetailsView.as_view()),


]