<template>
  <div>
    <!-- Botão aparece somente se não existir nenhum board -->
    <button v-if="!board" @click="createBoard" class="create-button">
      Criar Novo Board
    </button>

    <!-- Exibe o board quando criado -->
    <div v-if="board" class="kanban-board">
      <h1 class="board-title">{{ board.name }}</h1>
      <div class="columns">
        <div class="column" v-for="column in board.columns" :key="column.id">
          <h2 class="column-title">{{ column.name }}</h2>

          <button
            @click="showCardForm(column.id)"
            class="create-card-button"
            v-if="!isFormVisible(column.id)"
          >
            Criar Card
          </button>

          <div v-if="isFormVisible(column.id)" class="card-form">
            <input
              type="text"
              v-model="newCard.title"
              placeholder="Título do card"
              class="card-input"
            />
            <textarea
              v-model="newCard.description"
              placeholder="Descrição do card"
              class="card-textarea"
            ></textarea>
            <div class="form-buttons">
              <button
                @click="submitCard(column.id)"
                class="submit-button"
                :disabled="!newCard.title.trim()"
              >
                Salvar
              </button>
              <button @click="cancelCard()" class="cancel-button">
                Cancelar
              </button>
            </div>
          </div>

          <ul class="cards-list">
            <li class="card" v-for="card in column.cards" :key="card.id">
              <strong class="card-title">{{ card.title }}</strong>
              <p class="card-description">{{ card.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'KanbanBoard',
  data() {
    return {
      board: null,
      cardFormColumnId: null,
      newCard: {
        title: '',
        description: '',
      },
    }
  },
  methods: {
    async createBoard() {
      try {
        const boardRes = await axios.post('http://localhost:8000/api/board/', {
          name: 'Meu Novo Quadro',
        })
        const boardId = boardRes.data.id

        const columnNames = ['A Fazer', 'Fazendo', 'Feito']
        await Promise.all(
          columnNames.map((name, index) =>
            axios.post('http://localhost:8000/api/column/', {
              name,
              order: index,
              board: boardId,
            })
          )
        )

        const updatedBoard = await axios.get(
          `http://localhost:8000/api/board/${boardId}/`
        )
        this.board = updatedBoard.data
      } catch (error) {
        console.error('Erro ao criar o board:', error)
      }
    },
    showCardForm(columnId) {
      this.cardFormColumnId = columnId
      this.newCard.title = ''
      this.newCard.description = ''
    },
    cancelCard() {
      this.cardFormColumnId = null
      this.newCard.title = ''
      this.newCard.description = ''
    },
    isFormVisible(columnId) {
      return this.cardFormColumnId === columnId
    },
    async submitCard(columnId) {
      if (!this.newCard.title.trim()) {
        return
      }
      try {
        await axios.post('http://localhost:8000/api/card/', {
          title: this.newCard.title.trim(),
          description: this.newCard.description.trim(),
          order: 0,
          column: columnId,
        })
        const updatedBoard = await axios.get(
          `http://localhost:8000/api/board/${this.board.id}/`
        )
        this.board = updatedBoard.data
        this.cancelCard()
      } catch (error) {
        console.error('Erro ao criar card:', error)
      }
    },
  },
}
</script>

<style scoped>
.create-button {
  margin: 16px auto;
  display: block;
  padding: 10px 20px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.create-button:hover {
  background-color: #1c6fa0;
}

.create-card-button {
  margin-bottom: 12px;
  padding: 6px 12px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.create-card-button:hover {
  background-color: #1e8449;
}

.card-form {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-input,
.card-textarea {
  width: 100%;
  padding: 8px 10px;
  font-size: 0.9rem;
  border: 1px solid #bbb;
  border-radius: 4px;
  resize: vertical;
}

.card-textarea {
  min-height: 60px;
}

.form-buttons {
  display: flex;
  gap: 8px;
}

.submit-button {
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
}
.submit-button:disabled {
  background-color: #7fb3d5;
  cursor: not-allowed;
}
.submit-button:hover:enabled {
  background-color: #1c6fa0;
}

.cancel-button {
  background-color: #bbb;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
}
.cancel-button:hover {
  background-color: #999;
}

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
