from django.db import models

class Board(models.Model):
    name = models.CharField(max_length=255)

class Column(models.Model):
    name = models.CharField(max_length=255)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='columns')
    order = models.PositiveIntegerField(default=0)

class Card(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='cards')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
