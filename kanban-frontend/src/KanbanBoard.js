import axios from 'axios';

export default {
  data() {
    return {
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
      cardForms: {}, // Armazena quais colunas têm formulário visível
      newCard: {
        title: '',
        description: '',
      },
    };
  },

  methods: {
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
    async loadBoard() {
      try {
        const response = await axios.get('http://localhost:8000/api/board/', {
          headers: { Authorization: `Token ${this.token}` },
        });
        const boards = response.data;      
        if (Array.isArray(boards) && boards.length > 0) {
          this.board = boards[0];          
        } else {
          this.board = null;                
        }
        console.log("Dados do board carregado:", this.board);
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
    

    getColumnColor(columnId) {
      const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c'];
      return colors[columnId % colors.length];
    },
  },

  mounted() {
    // Verificação automática de token armazenado (opcional)
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
};
