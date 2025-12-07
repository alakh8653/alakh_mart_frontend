from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Review
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import F

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.all()
        q = self.request.query_params.get('q') or self.request.query_params.get('search')
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(categories__name=category)

        if q:
            # Use Postgres full-text search if available
            vector = SearchVector('title', weight='A') + SearchVector('description', weight='B')
            query = SearchQuery(q)
            queryset = queryset.annotate(rank=SearchRank(vector, query)).filter(rank__gt=0.0).order_by('-rank')

        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def reviews(self, request, pk=None):
        product = self.get_object()
        if request.method == 'POST':
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(product=product)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        reviews = product.product_reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
