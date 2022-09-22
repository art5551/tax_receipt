# Added redirect above ars3
from django.shortcuts import render, redirect
# Added following ars3
from django.contrib.auth import authenticate, login, logout
# And the following to show success or error messages
from django.contrib import messages
# This will allow us to use the django registration form ars3
from django.contrib.auth.forms import UserCreationForm
# Have to import our RegisterUserForm here to use it and get the added fields ars3
from .forms import RegisterUserForm
# Create your views here.


def login_user(request):
  if request.method== 'POST':
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
        return redirect('home')
    else:
        # Return an 'invalid login' error message.
        messages.success(request, 'There was an error logging in, try again...')
        return redirect('login')

  else: 
    return render(request, 'authenticate/login.html', {})

def logout_user(request):
  logout(request)
  return redirect('home')


# Created 9/20/2022 using the built in django form to register ars3
def register_user(request):
    if request.method == 'POST':
      form = RegisterUserForm(request.POST)
      if form.is_valid():
        form.save()
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(request, user)
        messages.success(request, 'Registration successful')
        return redirect('home')
    else:
      form = RegisterUserForm()
    return render(request, 'authenticate/register_user.html', {'form':form})