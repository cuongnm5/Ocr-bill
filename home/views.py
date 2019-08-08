from django.shortcuts import render, redirect 
from .forms import *
# Create your views here.

def home(request):
    return render(request, "pages/landing.html", {})

def upload_image(request): 
    return render(request, 'pages/image_upload.html') 

def login(request):
    return render(request, 'pages/login.html')