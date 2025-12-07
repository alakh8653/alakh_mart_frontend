from django.contrib import admin
from .models import Address, SavedPaymentMethod


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'city', 'country', 'created_at')
    search_fields = ('user__username', 'name', 'city', 'country')


@admin.register(SavedPaymentMethod)
class SavedPaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'provider', 'last4', 'brand', 'created_at')
    search_fields = ('user__username', 'provider', 'last4')
