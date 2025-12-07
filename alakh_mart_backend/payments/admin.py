from django.contrib import admin
from .models import WebhookEvent, IdempotencyKey


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ('event_id', 'processed_at')
    readonly_fields = ('payload', 'processed_at')


@admin.register(IdempotencyKey)
class IdempotencyKeyAdmin(admin.ModelAdmin):
    list_display = ('key', 'created_at')
    readonly_fields = ('response', 'created_at')
