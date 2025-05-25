<template>
  <div v-if="board" class="kanban-board">
    <h1 class="board-title">{{ board.name }}</h1>
    <div class="columns">
      <div class="column" v-for="column in board.columns" :key="column.id">
        <h2 class="column-title">{{ column.name }}</h2>
        <ul class="cards-list">
          <li class="card" v-for="card in column.cards" :key="card.id">
            <strong class="card-title">{{ card.title }}</strong>
            <p class="card-description">{{ card.description }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    Carregando...
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'KanbanBoard',
  data() {
    return {
      board: null,
    }
  },
  methods: {
    async loadBoard() {
      try {
        const response = await axios.get('http://localhost:8000/api/board/2/')
        this.board = response.data
      } catch (error) {
        console.error('Erro ao carregar o board:', error)
      }
    },
  },
  mounted() {
    this.loadBoard()
  },
}
</script>

<style scoped>
.kanban-board {
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.board-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.columns {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.column {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  padding: 16px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: #34495e;
  border-bottom: 2px solid #2980b9;
  padding-bottom: 8px;
}

.cards-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.card {
  background-color: #ecf0f1;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  transition: background-color 0.2s ease;
}

.card:hover {
  background-color: #d0e6f7;
}

.card-title {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #2c3e50;
}

.card-description {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

.loading {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 40px 0;
}
</style>
