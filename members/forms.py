# This will allow us to use the django registration form ars3
# Creatd this forms.py file in order to add more fields to registration form ars3
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms

class RegisterUserForm(UserCreationForm):
  # This will add these fields to the registration form ars3
  email = forms.EmailField(widget=forms.EmailInput(attrs={'class':'form-control', 'placeholder':'Enter email address'}))
  first_name = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter first name'}))
  last_name = forms.CharField(max_length=70, widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter last name'}))

  class Meta:
    model = User
    fields = ('username', 'first_name', 'last_name', 'email', 'password1')

  def __init__(self, *args, **kwargs):
    super(RegisterUserForm, self).__init__(*args, **kwargs)
    self.fields['username'].widget.attrs['class']= 'form-control'
    self.fields['username'].widget.attrs['placeholder']='Username'
    self.fields['password1'].widget.attrs['class']= 'form-control'
    self.fields['password1'].widget.attrs['placeholder']= 'Password 1'
    self.fields['password2'].widget.attrs['class']= 'form-control'
    self.fields['password2'].widget.attrs['placeholder']= 'Password 2'