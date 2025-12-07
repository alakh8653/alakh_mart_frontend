from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Create or recreate the products full-text search GIN index'

    def handle(self, *args, **options):
        sql = (
            "CREATE INDEX IF NOT EXISTS products_search_gin_idx ON products_product "
            "USING GIN (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));"
        )
        with connection.cursor() as cur:
            self.stdout.write('Creating GIN search index on products...')
            cur.execute(sql)
            self.stdout.write(self.style.SUCCESS('Search index created (or already existed).'))
