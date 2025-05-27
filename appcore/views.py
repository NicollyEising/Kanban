from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Column
from .serializers import ColumnSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import Board
from .serializers import BoardSerializer
from rest_framework.reverse import reverse

from rest_framework import generics
from .models import Card
from .serializers import CardSerializer


class ColumnCreateView(APIView):
    def post(self, request):
        serializer = ColumnSerializer(data=request.data)
        if serializer.is_valid():
            column = serializer.save()
            return Response(ColumnSerializer(column).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BoardDetailView(RetrieveAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class BoardCreateView(APIView):
    def post(self, request):
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            board = serializer.save()
            return Response(BoardSerializer(board).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ApiRootView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            'boards': reverse('board-list', request=request),
            # adicione outras rotas principais aqui, se houver
        })
    
class CardCreateView(generics.CreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer