from django.urls import path
from .views import BoardDetailView, ApiRootView

urlpatterns = [
    path('', ApiRootView.as_view(), name='api-root'), 
    path('api/board/<int:pk>/', BoardDetailView.as_view(), name='board-detail'),
]
