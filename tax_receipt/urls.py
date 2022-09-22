"""tax_receipt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
 # Added include to add urls from the main all into our project ars3
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Same as above added so this project will add urls from main app ars3
    path('', include('main.urls')),
    # Added for members but to take advantage of Djangos built in authorization functionality
    path('members/', include('django.contrib.auth.urls')),
    # Added to include the members app ars3
    path('members/', include('members.urls')),

]
