# urls.py
from django.urls import path
from .views import (
    ApiRootView, BoardListCreateView, BoardDetailView, ColumnCreateView,
    CardCreateView, RegisterUserView, CustomAuthToken
)

urlpatterns = [
    path('', ApiRootView.as_view(), name='api-root'),
    path('board/', BoardListCreateView.as_view(), name='board-list'),
    path('board/<int:pk>/', BoardDetailView.as_view(), name='board-detail'),
    path('column/', ColumnCreateView.as_view(), name='column-create'),
    path('card/', CardCreateView.as_view(), name='card-create'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
]
