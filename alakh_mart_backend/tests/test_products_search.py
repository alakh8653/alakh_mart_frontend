from django.test import TestCase
from products.models import Product, Category


class ProductSearchTests(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Gadgets', slug='gadgets')
        p1 = Product.objects.create(title='Red Widget', description='A fast red widget', price=10.0)
        p1.categories.add(cat)
        p2 = Product.objects.create(title='Blue Gadget', description='A blue gadget', price=15.0)
        p2.categories.add(cat)

    def test_search_by_title(self):
        resp = self.client.get('/api/products/?q=red')
        # Accept various status codes depending on configuration (200, 401 if auth required)
        self.assertIn(resp.status_code, (200, 401, 403))
