from django.urls import path
from .views import BoardDetailView, BoardCreateView, ColumnCreateView, ApiRootView, CardCreateView


urlpatterns = [
    path('', ApiRootView.as_view(), name='api-root'), 
    path('board/<int:pk>/', BoardDetailView.as_view(), name='board-detail'),
    path('board/', BoardCreateView.as_view(), name='board-create'),
    path('column/', ColumnCreateView.as_view(), name='column-create'),
    path('card/', CardCreateView.as_view(), name='card-create'),

]
