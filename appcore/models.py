from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def create_board_and_columns(sender, instance, created, **kwargs):
    if created:
        # Cria o board para o usuário
        board = Board.objects.create(name=f"Kanban de {instance.username}", user=instance)
        
        # Lista de nomes das colunas padrão
        default_columns = ["A Fazer", "Em Progresso", "Feito"]
        
        # Cria as colunas padrão para esse board
        for column_name in default_columns:
            Column.objects.create(name=column_name, board=board)

class Board(models.Model):
    name = models.CharField(max_length=255)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='board')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'board'

class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='columns')
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'board_column'  # corresponde à tabela 'board_column'

class Card(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='cards')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'card'  # corresponde à tabela 'card'
