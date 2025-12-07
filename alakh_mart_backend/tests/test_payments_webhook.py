from django.test import TestCase, Client
from orders.models import Order, Payment
from django.contrib.auth.models import User


class PaymentsWebhookTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='u1', password='pass')
        self.order = Order.objects.create(
            user=self.user,
            order_number='ORD-TEST-1234',
            total_price=10.00,
            shipping_name='Test',
            shipping_address='Addr',
            shipping_city='City',
            shipping_state='State',
            shipping_zip='00000',
            shipping_country='Country',
        )
        Payment.objects.create(order=self.order, amount=self.order.total_price, status='pending')

    def test_stripe_webhook_payment_succeeded(self):
        payload = {
            'type': 'payment_intent.succeeded',
            'data': {
                'object': {
                    'id': 'pi_test_123',
                    'metadata': {
                        'order_number': 'ORD-TEST-1234'
                    }
                }
            }
        }
        resp = self.client.post('/api/payments/stripe/webhook/', data=payload, content_type='application/json')
        self.assertEqual(resp.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'paid')
        self.assertEqual(self.order.payment.status, 'completed')
