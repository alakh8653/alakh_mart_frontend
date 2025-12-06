from celery import shared_task
from orders.models import Payment, Order
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@shared_task(bind=True)
def handle_payment_intent_succeeded(self, order_number, stripe_obj=None):
    """Fulfill a successful payment intent.

    - Mark Payment as completed
    - Update Order status to 'paid'
    - (Placeholder) send receipt email / notifications
    """
    try:
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return {'status': 'order_not_found', 'order_number': order_number}

        payment = getattr(order, 'payment', None)
        if not payment:
            # create a Payment record if absent
            payment = Payment.objects.create(order=order, amount=order.total_price, status='completed')
        else:
            payment.status = 'completed'
            # If Stripe provides a transaction id, set it
            txn = None
            if stripe_obj and isinstance(stripe_obj, dict):
                txn = stripe_obj.get('id')
            if txn:
                payment.transaction_id = txn
            payment.save()

        order.status = 'paid'
        order.save()

        # Enqueue/send receipt email
        try:
            send_receipt_email.delay(order.id)
        except Exception:
            try:
                send_receipt_email(order.id)
            except Exception:
                pass

        return {'status': 'ok', 'order_number': order_number}
    except Exception as e:
        # In production, log exception and possibly retry
        raise self.retry(exc=e, countdown=10, max_retries=3)


@shared_task
def example_daily_task():
    # Example periodic task (run via celery-beat)
    # This could perform cleanup, send daily reports, reconcile payments, etc.
    return {'status': 'ok'}


@shared_task
def send_receipt_email(order_id):
    """Send a simple receipt email for a completed order.

    In production, replace with templated email and links.
    """
    try:
        order = Order.objects.get(pk=order_id)
        subject = f"Your receipt for order {order.order_number}"
        recipient = order.user.email or ''
        if recipient:
            html_message = render_to_string('emails/receipt.html', {'order': order, 'user': order.user})
            plain_message = strip_tags(html_message)
            send_mail(subject, plain_message, settings.DEFAULT_FROM_EMAIL, [recipient], html_message=html_message, fail_silently=True)
            return {'status': 'email_sent'}
        return {'status': 'no_recipient'}
    except Order.DoesNotExist:
        return {'status': 'order_not_found'}
