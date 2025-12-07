# alakh_mart Backend

This folder contains Django backend for AlakhMart.

# Backend (Django) local Docker development

Quick start (from this directory):

```bash
# copy .env.example to .env and edit if needed
cp .env.example .env

docker-compose up --build

# apply migrations and create superuser in another shell
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

The Django app will be available at `http://localhost:8000` and the Celery worker will be running as the `worker` service.

Development notes:

- Run tests inside docker-compose environment:

```bash
docker-compose up --build -d
docker-compose exec web python manage.py migrate
docker-compose exec web pytest -q
```

- To re-create the search index:

```bash
docker-compose exec web python manage.py recreate_search_index
```

