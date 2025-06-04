# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.reverse import reverse
from .models import Board, Column, Card
from .serializers import BoardSerializer, ColumnSerializer, CardSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.serializers import ModelSerializer

class ApiRootView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            'boards': reverse('board-list', request=request),
        })

class BoardListCreateView(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        board = serializer.save(user=self.request.user)
        Column.objects.bulk_create([
            Column(name='A Fazer', board=board, order=1),
            Column(name='Fazendo', board=board, order=2),
            Column(name='Feito', board=board, order=3),
        ])

class BoardDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            board = Board.objects.get(pk=pk, user=request.user)
        except Board.DoesNotExist:
            return Response(
                {"detail": "Nenhum board encontrado para este usuário com este ID."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BoardSerializer(board)
        return Response(serializer.data)

class ColumnCreateView(APIView):
    def post(self, request):
        serializer = ColumnSerializer(data=request.data)
        if serializer.is_valid():
            column = serializer.save()
            return Response(ColumnSerializer(column).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardCreateView(generics.CreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username
        })
