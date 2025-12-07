from rest_framework.test import APIClient
from django.test import TestCase
from django.contrib.auth.models import User
from products.models import Product, Category
from orders.models import Order, Payment


class OrdersPaymentFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='buyer', password='pass', email='buyer@example.com')
        self.client.force_authenticate(self.user)
        cat = Category.objects.create(name='Gadgets', slug='gadgets')
        self.product = Product.objects.create(title='Widget', description='A widget', price=9.99, stock=10)
        self.product.categories.add(cat)

    def test_order_payment_lifecycle(self):
        # Create an order via the model for simplicity
        order = Order.objects.create(
            user=self.user,
            order_number='ORD-FLOW-1',
            total_price=9.99,
            shipping_name='Buyer',
            shipping_address='123 Road',
            shipping_city='City',
            shipping_state='State',
            shipping_zip='00000',
            shipping_country='Country',
        )
        Payment.objects.create(order=order, amount=order.total_price, status='pending')

        # Call create-payment endpoint
        url = f'/api/orders/{order.pk}/create-payment/'
        resp = self.client.post(url, {'amount': str(order.total_price)}, format='json')
        self.assertIn(resp.status_code, (200, 201, 202))

        # Simulate Stripe webhook payment succeeded
        payload = {
            'type': 'payment_intent.succeeded',
            'data': {'object': {'id': 'pi_flow_1', 'metadata': {'order_number': order.order_number}}}
        }
        resp2 = self.client.post('/api/payments/stripe/webhook/', data=payload, format='json')
        self.assertEqual(resp2.status_code, 200)

        order.refresh_from_db()
        self.assertEqual(order.status, 'paid')
        self.assertEqual(order.payment.status, 'completed')
