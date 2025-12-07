from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS products_search_gin_idx ON products_product "
                "USING GIN (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));"
            ),
            reverse_sql=(
                "DROP INDEX IF EXISTS products_search_gin_idx;"
            )
        ),
    ]
