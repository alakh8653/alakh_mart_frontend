from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils.timezone import now
import uuid
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, PaymentSerializer
from products.models import Product
from payments.models import IdempotencyKey
from django.shortcuts import get_object_or_404
import json
try:
    import stripe
    from django.conf import settings as djsettings
    stripe.api_key = getattr(djsettings, 'STRIPE_SECRET_KEY', None)
except Exception:
    stripe = None

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            items_data = request.data.get('items', [])
            order = Order.objects.create(
                user=request.user,
                order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
                total_price=serializer.validated_data['total_price'],
                shipping_name=serializer.validated_data['shipping_name'],
                shipping_address=serializer.validated_data['shipping_address'],
                shipping_city=serializer.validated_data['shipping_city'],
                shipping_state=serializer.validated_data['shipping_state'],
                shipping_zip=serializer.validated_data['shipping_zip'],
                shipping_country=serializer.validated_data['shipping_country'],
            )
            for item in items_data:
                product = Product.objects.get(pk=item['product_id'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price=product.price
                )
            Payment.objects.create(order=order, amount=order.total_price, status='pending')
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'completed'
        payment.transaction_id = f"TXN-{uuid.uuid4().hex[:12]}"
        payment.save()
        payment.order.status = 'paid'
        payment.order.save()
        return Response(PaymentSerializer(payment).data)


class OrderPaymentViewSet(viewsets.ViewSet):
    """A small viewset to create PaymentIntents for an order on the server side."""

    def create(self, request, order_pk=None):
        # Create a payment intent for the specified order (idempotent)
        order = get_object_or_404(Order, pk=order_pk)

        # Only owner or staff can create payment for order
        if request.user != order.user and not request.user.is_staff:
            return Response({'detail': 'Forbidden'}, status=403)

        try:
            data = json.loads(request.body.decode('utf-8')) if request.body else {}
        except Exception:
            data = {}

        idempotency_key = request.META.get('HTTP_IDEMPOTENCY_KEY') or data.get('idempotency_key')
        # Check idempotency
        if idempotency_key:
            existing = IdempotencyKey.objects.filter(key=idempotency_key).first()
            if existing and existing.response:
                return Response(existing.response)

        amount = int(float(data.get('amount', order.total_price)) * 100)
        currency = data.get('currency', 'usd')

        if stripe:
            try:
                pi = stripe.PaymentIntent.create(
                    amount=amount,
                    currency=currency,
                    metadata={'order_number': order.order_number},
                )
                resp = {'client_secret': pi.client_secret, 'id': pi.id}
            except Exception as e:
                return Response({'error': str(e)}, status=400)
        else:
            resp = {'client_secret': f'fake-{order.order_number}', 'id': f'local-{order.order_number}'}

        if idempotency_key:
            try:
                IdempotencyKey.objects.update_or_create(key=idempotency_key, defaults={'response': resp})
            except Exception:
                pass

        return Response(resp)
