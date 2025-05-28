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
    getColumnColor(columnId) {
      const colors = [
        '#03A9F4', // Azul
      ];
      return colors[columnId % colors.length];
    },
  },
}
