from django.db import models
from django.contrib.auth.models import User


# Create your models here.
# Account will be the bank/credit card etc accounts.
class Account(models.Model):
  name = models.CharField(max_length=100, )
  number = models.CharField(max_length=25)
  description = models.CharField(max_length=250)

# Asset will be foreign key in Expense table.
# Each Receipt will have one Asset it is assigned to.
class Asset(models.Model):
  name = models.CharField(max_length=100)
  date = models.DateField(auto_now_add=True)
  description = models.CharField(max_length=250)
  taxable = models.BooleanField(default=True)

# Categories will be assigned to each Expense
class Category(models.Model):
  name = models.CharField(max_length=50)
  description = models.CharField(max_length=250)


# Expense will be the main table.
class Expense(models.Model):
  account = models.ForeignKey(Account, null=True, on_delete=models.SET_NULL)
  asset = models.ForeignKey(Asset, null=True, on_delete=models.SET_NULL)
  category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
  user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  datetime = models.DateTimeField(auto_now_add=True)
  payee = models.CharField(max_length=150)
  invoice = models.CharField(max_length=50)
  desciption = models.CharField(max_length=250)
  amount = models.FloatField()
