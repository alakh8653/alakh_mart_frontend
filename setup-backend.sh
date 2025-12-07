#!/bin/bash
# Django Backend Setup Script
# Run this after cloning/creating the backend directory

set -e

echo "🚀 Setting up Django Backend for AlakhMart..."

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install django==5.2.9 \
    djangorestframework==3.16.1 \
    django-cors-headers==4.3.1 \
    python-decouple==3.8 \
    pillow==12.0.0 \
    psycopg2-binary==2.9.9 \
    django-filter==24.1

# Create Django project structure
echo "🏗️ Creating Django project..."
if [ ! -d "alakh_mart" ]; then
    django-admin startproject alakh_mart .
fi

# Create apps
echo "📱 Creating Django apps..."
python manage.py startapp products 2>/dev/null || true
python manage.py startapp orders 2>/dev/null || true
python manage.py startapp users 2>/dev/null || true

# Create .env file
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
fi

# Run migrations
echo "🗄️ Running migrations..."
python manage.py makemigrations 2>/dev/null || true
python manage.py migrate

# Create superuser (optional)
echo "👤 Creating superuser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell

echo "✅ Django backend setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update models in products/models.py, orders/models.py, users/models.py"
echo "2. Create serializers in */serializers.py"
echo "3. Create views and URLs"
echo "4. Run: python manage.py runserver 8000"
echo ""
echo "Frontend API URL: http://localhost:8000/api"
echo "Admin panel: http://localhost:8000/admin"
