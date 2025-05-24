from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board
from .serializers import BoardSerializer
from rest_framework import generics

class BoardDetailView(generics.RetrieveAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    

from rest_framework.views import APIView
from rest_framework.response import Response

class ApiRootView(APIView):
    def get(self, request):
        return Response({"message": "Bem-vindo à API"})

