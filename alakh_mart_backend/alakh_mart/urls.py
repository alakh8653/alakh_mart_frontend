from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, CategoryViewSet
from orders.views import OrderViewSet, PaymentViewSet
from users.views import AddressViewSet, SavedPaymentMethodViewSet, register_view, login_view, current_user_view
from django.urls import include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'payment-methods', SavedPaymentMethodViewSet, basename='payment-method')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/auth/register/', register_view, name='auth-register'),
    path('api/auth/login/', login_view, name='auth-login'),
    path('api/auth/user/', current_user_view, name='auth-user'),
    path('api/payments/', include('payments.urls')),
    path('api/orders/', include('orders.urls')),
]
