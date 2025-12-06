import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.conf import settings

# import Celery task to fulfill payments
try:
    from .tasks import handle_payment_intent_succeeded
except Exception:
    handle_payment_intent_succeeded = None

# Stripe import is optional — keep light scaffold. If stripe lib present, you can validate signatures.
try:
    import stripe
    stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)
except Exception:
    stripe = None

@csrf_exempt
def stripe_webhook(request):
    """A lightweight Stripe webhook endpoint scaffold.

    - Validate signature if `STRIPE_WEBHOOK_SECRET` is set.
    - Dispatch events asynchronously (Celery) in production.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    if stripe and getattr(settings, 'STRIPE_WEBHOOK_SECRET', None):
        try:
            event = stripe.Webhook.construct_event(
                payload=payload, sig_header=sig_header, secret=settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)
    else:
        try:
            event = json.loads(payload.decode('utf-8'))
        except Exception:
            return HttpResponse(status=400)

    # Basic handling: respond to payment_intent.succeeded
    event_type = event.get('type') if isinstance(event, dict) else getattr(event, 'type', None)

    if event_type == 'payment_intent.succeeded':
        # Try to extract order_number from event metadata and enqueue fulfillment task
        obj = event.get('data', {}).get('object', {}) if isinstance(event, dict) else {}
        metadata = obj.get('metadata', {}) if isinstance(obj, dict) else {}
        order_number = metadata.get('order_number')
        if handle_payment_intent_succeeded and order_number:
            # enqueue task (Celery) for async processing
            try:
                handle_payment_intent_succeeded.delay(order_number, obj)
            except Exception:
                # fallback to sync call if Celery not available
                try:
                    handle_payment_intent_succeeded(order_number, obj)
                except Exception:
                    pass

    return JsonResponse({'status': 'received'})


@csrf_exempt
def create_payment_intent(request):
    """Create a Stripe PaymentIntent (or a placeholder) and return client secret.

    Supports idempotency by accepting header `Idempotency-Key`.
    Stores a simple IdempotencyKey record to avoid duplicate payment intents.
    """
    if request.method != 'POST':
        return HttpResponse(status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return HttpResponse(status=400)

    idempotency_key = request.META.get('HTTP_IDEMPOTENCY_KEY')

    # Simple idempotency handling using model
    if idempotency_key:
        from .models import IdempotencyKey
        existing = IdempotencyKey.objects.filter(key=idempotency_key).first()
        if existing and existing.response:
            return JsonResponse(existing.response)

    amount = int(float(data.get('amount', 0)) * 100)
    currency = data.get('currency', 'usd')

    if stripe:
        try:
            pi = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                metadata=data.get('metadata', {}),
            )
            resp = {'client_secret': pi.client_secret, 'id': pi.id}
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        # Fallback: return a fake client secret for local/dev use
        resp = {'client_secret': f'fake_client_secret_{data.get("metadata",{}).get("order_number","")}', 'id': 'local_pi_123'}

    if idempotency_key:
        try:
            IdempotencyKey.objects.update_or_create(key=idempotency_key, defaults={'response': resp})
        except Exception:
            pass

    return JsonResponse(resp)
