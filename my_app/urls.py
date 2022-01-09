from django.urls import path
from . import views

urlpatterns = [
    path('', views.open_camera, name='open-camera'),
    path('player/', views.detect, name='mood-detect-play'),
]