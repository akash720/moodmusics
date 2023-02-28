#!/usr/bin/env bash
# exit on error
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
(crontab -l 2>/dev/null; echo "*/1 * * * *  ~/clear_mem.sh") | crontab -