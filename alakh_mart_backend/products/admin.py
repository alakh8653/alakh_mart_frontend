from django.contrib import admin
from .models import Product, Category, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'stock', 'featured', 'rating', 'created_at']
    list_filter = ['featured', 'categories', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['categories']
    readonly_fields = ['created_at', 'updated_at', 'rating', 'reviews']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user_name', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['product__title', 'user_name', 'comment']
    readonly_fields = ['created_at']
