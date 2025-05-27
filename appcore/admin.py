from django.contrib import admin
from .models import Board, Column, Card

class CardInline(admin.TabularInline):
    model = Card
    extra = 0
    ordering = ['order']
    fields = ['title', 'description', 'order']
    readonly_fields = ['created_at']
    show_change_link = True

class ColumnInline(admin.TabularInline):
    model = Column
    extra = 0
    ordering = ['order']
    fields = ['name', 'order']
    show_change_link = True

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    inlines = [ColumnInline]

@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'board', 'order']
    list_filter = ['board']
    ordering = ['board', 'order']
    inlines = [CardInline]

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'column', 'order', 'created_at']
    list_filter = ['column']
    ordering = ['column', 'order']
    search_fields = ['title', 'description']

