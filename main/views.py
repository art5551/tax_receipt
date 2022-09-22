from django.shortcuts import render, redirect
# The next two are used to import data from csv
import csv
import sys

from .models import Account


# Create your views here.
# Starting with the home view to show first page. ars3
# Usercan select login from this page ars3
def home(request):
  return render(request, 'main/home.html')

def admin_tables(request):
  return render(request, 'main/admin.html')

# Below are import functions to populat from csv files
# import csv from ~/projects/tax_receipts/tax_receipt/accounts.csv
def add_account(request):

  accounts = []
  # TODO: Read accounts into memory from file
  # filename = sys.argv[1]
  filename = 'home/astark/projects/tax_receipts/tax_receipt/accounts.csv'
  with open(filename, "r") as file:
      reader = csv.DictReader(file)
      for account in reader:
          name = account['name'].strip()
          number = account['number'].strip()
          description = account['description'].strip()
          accounts.append({'name':name, 'number':number,'description':description})
      print(accounts)
      file.close()

  for account in accounts:
      account = Account(
          name = account['name'],
          number = account['number'],
          description = account['description'],
      )
      account.save()