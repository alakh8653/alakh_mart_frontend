FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y build-essential libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

COPY . /app

# collect static (if any)
RUN python manage.py collectstatic --noinput || true

CMD ["gunicorn", "alakh_mart.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
