import axios from 'axios';

export default {
  data() {
    return {
      editingCard: null,
      authTab: 'login',
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        username: '',
        password: '',
      },
      authError: '',
      registerSuccess: false,
      loading: false,
      isAuthenticated: false,
      token: '',
      board: null,
      cardForms: {},
      newCard: {
        title: '',
        description: '',
      },
    };
  },

  mounted() {
    const storedToken = localStorage.getItem('kanban_token');
    if (storedToken) {
      this.token = storedToken;
      this.isAuthenticated = true;
      this.loadBoard();
    }
  },

  watch: {
    token(newVal) {
      if (newVal) {
        localStorage.setItem('kanban_token', newVal);
      } else {
        localStorage.removeItem('kanban_token');
      }
    },
  },

  methods: {
    getColumnColor(columnId) {
      const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c'];
      return colors[columnId % colors.length];
    },

    async loadBoard() {
      try {
        const response = await axios.get('http://localhost:8000/api/board/', {
          headers: { Authorization: `Token ${this.token}` },
        });
        const boards = response.data;
        this.board = Array.isArray(boards) && boards.length > 0 ? boards[0] : null;
        this.initCardForms();
      } catch (error) {
        console.error('Erro ao carregar board:', error);
      }
    },

    async createBoard() {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/board/',
          { name: 'Meu Quadro' },
          { headers: { Authorization: `Token ${this.token}` } }
        );
        this.board = response.data;
        this.initCardForms();
      } catch (error) {
        console.error('Erro ao criar board:', error);
      }
    },

    initCardForms() {
      this.cardForms = {};
      if (this.board && this.board.columns) {
        this.board.columns.forEach((col) => {
          this.cardForms[col.id] = false;
        });
      }
    },

    showCardForm(columnId) {
      this.cancelCard();
      this.cardForms[columnId] = true;
    },

    cancelCard() {
      Object.keys(this.cardForms).forEach((key) => {
        this.cardForms[key] = false;
      });
      this.newCard = { title: '', description: '' };
    },

    isFormVisible(columnId) {
      return this.cardForms[columnId];
    },

    async submitCard(columnId) {
      if (!this.newCard.title.trim()) return;
      try {
        const response = await axios.post(
          'http://localhost:8000/api/card/',
          {
            title: this.newCard.title,
            description: this.newCard.description,
            column: columnId,
          },
          { headers: { Authorization: `Token ${this.token}` } }
        );
        const createdCard = response.data;
        const column = this.board.columns.find((col) => col.id === columnId);
        if (column) {
          column.cards.push(createdCard);
        }
        this.cancelCard();
      } catch (error) {
        console.error('Erro ao adicionar card:', error);
      }
    },

    startEditCard(card) {
      this.editingCard = { ...card };
    },

    cancelEditCard() {
      this.editingCard = null;
    },

    async submitEditCard() {
      try {
        await axios.put(`http://localhost:8000/api/card/${this.editingCard.id}/`, this.editingCard, {
          headers: { Authorization: `Token ${this.token}` },
        });
        this.editingCard = null;
        this.loadBoard();
      } catch (err) {
        console.error(err);
      }
    },

    async deleteCard(cardId) {
      try {
        await axios.delete(`http://localhost:8000/api/card/${cardId}/`, {
          headers: { Authorization: `Token ${this.token}` },
        });
        this.loadBoard();
      } catch (err) {
        console.error(err);
      }
    },

    async login() {
      this.loading = true;
      this.authError = '';
      try {
        const response = await axios.post('http://localhost:8000/api/login/', this.loginForm);
        this.token = response.data.token;
        this.isAuthenticated = true;
        await this.loadBoard();
      } catch (error) {
        this.authError = 'Usuário ou senha inválidos.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async register() {
      this.loading = true;
      this.authError = '';
      try {
        await axios.post('http://localhost:8000/api/register/', this.registerForm);
        this.registerSuccess = true;
        this.authTab = 'login';
      } catch (error) {
        this.authError = 'Erro ao registrar. Tente outro nome de usuário.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = '';
      this.isAuthenticated = false;
      this.board = null;
      this.loginForm = { username: '', password: '' };
      this.registerForm = { username: '', password: '' };
    },
  },
};
