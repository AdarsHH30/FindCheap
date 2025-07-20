#!/bin/bash

(cd Backend && source .venv/bin/activate && python manage.py runserver) &

sleep 3

cd Frontend && pnpm dev