from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_and_login(self):
        reg_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'strongpassword123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        resp = self.client.post('/api/auth/register/', data=reg_data, format='json')
        self.assertIn(resp.status_code, (200, 201))
        self.assertIn('access', resp.data)

        # login with username
        login_data = {'username': 'testuser', 'password': 'strongpassword123'}
        resp2 = self.client.post('/api/auth/login/', data=login_data, format='json')
        self.assertIn(resp2.status_code, (200,))
        self.assertIn('access', resp2.data)
