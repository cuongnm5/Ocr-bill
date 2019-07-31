from django.shortcuts import render, redirect 
from .forms import *
# Create your views here.

def home(request):
    return render(request, "pages/home.html", {})

def hotel_image_view(request): 
  
    if request.method == 'POST': 
        form = TestForm(request.POST, request.FILES) 
  
        if form.is_valid(): 
            form.save() 
            return redirect('success') 
    else: 
        form = TestForm() 
    return render(request, 'pages/image_upload.html', {'form' : form}) 
  
  
def success(request): 
    return render(request, "pages/success.html") 

def display_hotel_images(request): 

    if request.method == 'GET': 

        # getting all the objects of hotel. 
        Hotels = Test.objects.all() 
        return render(request, 'pages/display.html', 
                        {'hotel_images' : Hotels}) 