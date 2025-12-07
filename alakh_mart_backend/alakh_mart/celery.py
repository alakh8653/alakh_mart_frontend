import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alakh_mart.settings')

app = Celery('alakh_mart')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
