# Expose Celery app as `celery_app` for `manage.py celery` and other tools
from .celery import app as celery_app

__all__ = ('celery_app',)
