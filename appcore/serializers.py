# serializers.py

from rest_framework import serializers
from .models import Board, Column, Card

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'order', 'column']

class ColumnSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)  # usa related_name='cards' no FK


    
    class Meta:
        model = Column
        fields = '__all__'


class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)  # usa related_name='columns' no FK

    class Meta:
        model = Board
        fields = ['id', 'name', 'columns']
