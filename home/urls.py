from django.urls import path
from . import views
from django.conf import settings 
from django.conf.urls.static import static 
urlpatterns = [
    path('', views.home, name='home'),
    path('image_upload/', views.hotel_image_view, name = 'image_upload'), 
    path('success', views.success, name = 'success'),
    path('hotel_images', views.display_hotel_images, name = 'hotel_images'),
]

if settings.DEBUG: 
        urlpatterns += static(settings.MEDIA_URL, 
                              document_root=settings.MEDIA_ROOT) 

