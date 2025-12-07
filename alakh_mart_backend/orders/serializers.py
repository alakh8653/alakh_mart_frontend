from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order, OrderItem, Payment

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(source='product.price', decimal_places=2, max_digits=10, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'product_price', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    item_data = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'total_price', 'status',
            'shipping_name', 'shipping_address', 'shipping_city', 'shipping_state',
            'shipping_zip', 'shipping_country', 'items', 'item_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'user', 'created_at', 'updated_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'amount', 'status', 'transaction_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
