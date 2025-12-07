from django.test import TestCase
from django.urls import reverse


class ApiBasicTests(TestCase):
    def test_schema_endpoint(self):
        resp = self.client.get('/api/schema/')
        # Schema should exist (may be 200 or 401 depending on auth settings)
        self.assertIn(resp.status_code, (200, 401, 403))

    def test_docs_pages(self):
        resp = self.client.get('/api/docs/')
        self.assertIn(resp.status_code, (200, 302, 401, 403))
        resp2 = self.client.get('/api/redoc/')
        self.assertIn(resp2.status_code, (200, 302, 401, 403))
