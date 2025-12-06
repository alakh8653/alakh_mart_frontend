from django.urls import path
from .views import stripe_webhook

urlpatterns = [
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path('stripe/create-intent/', create_payment_intent, name='stripe-create-intent'),
]
