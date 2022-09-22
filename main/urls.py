# Created this file in the members app to list urls ars3
from django.urls import path
from . import views

urlpatterns = [
    # This will be the members urls website ars3
    path('', views.home, name='home'),
    path('add_account', views.add_account, name='add_account'),

]