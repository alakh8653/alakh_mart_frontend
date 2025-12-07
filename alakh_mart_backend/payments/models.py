from django.db import models
import uuid


class WebhookEvent(models.Model):
    """Track processed webhook events to ensure idempotency."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_id = models.CharField(max_length=255, unique=True)
    payload = models.JSONField()
    processed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.event_id


class IdempotencyKey(models.Model):
    """Store idempotency keys for payment creation to avoid duplicates."""
    key = models.CharField(max_length=255, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    response = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.key
