from django.urls import path
from .views import OrderPaymentViewSet

payment_create = OrderPaymentViewSet.as_view({'post': 'create'})

urlpatterns = [
    path('<uuid:order_pk>/create-payment/', payment_create, name='order-create-payment'),
]
