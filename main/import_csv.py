# Going to import the accounts via a csv file from excel ars3

# The next two are used to import data from csv
import csv
import sys

from models import Account

def main():

    # Ensure correct usage.
    # Starting will just manually enter the filename
    if len(sys.argv) != 2:
        sys.exit("Usage: python import_csv.py FILENAME")

    accounts = []
    # TODO: Read accounts into memory from file
    filename = sys.argv[1]
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

if __name__ == "__main__":
    main()
