#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."

python3 -m pip install -r requirements.txt

echo "Migrating database..."

python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

echo "Collecting static files..."

python3 manage.py collectstatic --noinput