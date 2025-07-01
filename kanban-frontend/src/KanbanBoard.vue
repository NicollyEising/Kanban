<template>
  <div class="kanban-container">
    <!-- Autenticação -->
    <transition name="fade-in">
      <div
        v-if="!isAuthenticated"
        class="auth-container ui middle aligned center aligned grid fullscreen"
        style="
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <div class="column" style="max-width: 450px; text-align: center">
          <h2 class="ui icon header">
            <i class="huge circular teal clipboard outline icon"></i>
            Bem-vindo ao seu Kanban!
          </h2>
          <p style="margin-bottom: 2.5em; color: #666; font-size: 1.1rem">
            Organize suas tarefas, ideias e projetos de forma simples e
            eficiente.<br />
            Faça login ou crie uma conta para começar.
          </p>

          <div class="ui top attached tabular menu">
            <a
              :class="{ active: authTab === 'login' }"
              @click="authTab = 'login'"
              class="item"
              >Login</a
            >
            <a
              :class="{ active: authTab === 'register' }"
              @click="authTab = 'register'"
              class="item"
              >Cadastro</a
            >
          </div>

          <div class="ui bottom attached segment">
            <!-- Formulário Login -->
            <form
              v-if="authTab === 'login'"
              class="ui form"
              @submit.prevent="login"
            >
              <div class="field">
                <label>Usuário</label>
                <input
                  type="text"
                  v-model="loginForm.username"
                  required
                  autocomplete="username"
                />
              </div>
              <div class="field">
                <label>Senha</label>
                <input
                  type="password"
                  v-model="loginForm.password"
                  required
                  autocomplete="current-password"
                />
              </div>
              <button
                type="submit"
                class="ui fluid large teal submit button"
                :disabled="loading"
              >
                {{ loading ? "Entrando..." : "Entrar" }}
              </button>
              <div
                v-if="authError"
                class="ui red message"
                style="margin-top: 1em"
              >
                {{ authError }}
              </div>
            </form>

            <!-- Formulário Cadastro -->
            <form
              v-if="authTab === 'register'"
              class="ui form"
              @submit.prevent="register"
            >
              <div class="field">
                <label>Usuário</label>
                <input
                  type="text"
                  v-model="registerForm.username"
                  required
                  autocomplete="username"
                />
              </div>
              <div class="field">
                <label>Senha</label>
                <input
                  type="password"
                  v-model="registerForm.password"
                  required
                  autocomplete="new-password"
                />
              </div>
              <button
                type="submit"
                class="ui fluid large teal submit button"
                :disabled="loading"
              >
                {{ loading ? "Registrando..." : "Registrar" }}
              </button>
              <div
                v-if="authError"
                class="ui red message"
                style="margin-top: 1em"
              >
                {{ authError }}
              </div>
              <div
                v-if="registerSuccess"
                class="ui positive message"
                style="margin-top: 1em"
              >
                Registro realizado com sucesso! Faça login.
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Board com colunas e cards -->
    <div v-if="isAuthenticated && !board" class="ui warning message">
      Usuário autenticado, mas o board não foi carregado.
    </div>
    <div v-if="!isAuthenticated" class="ui message">
      Usuário não autenticado.
    </div>
    <div
      v-if="board && (!board.columns || board.columns.length === 0)"
      class="ui info message"
    >
      Board carregado, mas nenhuma coluna foi encontrada.
    </div>
    <div
      v-if="isAuthenticated && board"
      class="ui container"
      style="margin-top: 3em; margin-bottom: 3em"
    >
      <div
        class="ui center aligned header board-title"
        style="position: relative"
      >
        <h1 style="margin-bottom: 0.2em">{{ board.name }}</h1>
        <div class="sub header" style="color: #777; font-size: 1.1rem">
          Gerencie suas colunas e cards aqui
        </div>
        <button
          @click="logout"
          class="ui red tiny button"
          style="position: absolute; right: 20px; top: 20px"
        >
          Sair
        </button>
      </div>

      <div
        class="ui centered stackable four column grid"
        style="
          margin-top: 2.5em;
          max-width: 100%;
          margin-left: auto;
          margin-right: auto;
        "
      >
        <transition-group name="column-fade" tag="div" class="columns">
          <div
            v-for="column in board.columns"
            :key="column.id"
            class="column"
            style="box-shadow: none"
          >
            <div class="ui fluid card column-card">
              <div
                class="content column-header"
                :style="{
                  background: getColumnColor(column.id),
                  color: '#fff',
                  padding: '12px 16px',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                }"
              >
                <div class="header" style="font-size: 1.1rem; font-weight: 600">
                  {{ column.name }}
                </div>
                <div
                  class="meta"
                  style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem"
                >
                  {{ column.cards.length }} cards
                </div>
              </div>

              <div class="content">
                <transition name="form-fade">
                  <div v-if="isFormVisible(column.id)" class="ui form">
                    <div class="field">
                      <label style="font-weight: 500">Título do card</label>
                      <input
                        type="text"
                        v-model="newCard.title"
                        placeholder="Ex: Reunião às 15h"
                        autofocus
                      />
                    </div>
                    <div class="field">
                      <label style="font-weight: 500">Descrição</label>
                      <textarea
                        rows="3"
                        v-model="newCard.description"
                        placeholder="Detalhes do card"
                      ></textarea>
                    </div>
                    <div class="ui two small buttons">
                      <button
                        @click="submitCard(column.id)"
                        class="ui secondary button"
                        :disabled="!newCard.title.trim()"
                      >
                        <i class="save icon"></i> Salvar
                      </button>
                      <button @click="cancelCard" class="ui button">
                        <i class="times icon"></i> Cancelar
                      </button>
                    </div>
                  </div>
                </transition>

                <button
                  @click="showCardForm(column.id)"
                  class="ui fluid tiny blue animated button"
                  style="margin-top: 10px"
                >
                  <div class="visible content">
                    <i class="plus icon"></i> Novo Card
                  </div>
                  <div class="hidden content">
                    Adicionar &nbsp;<i class="arrow down icon"></i>
                  </div>
                </button>
              </div>

              <div
                class="content card-list"
                style="max-height: 450px; overflow-y: auto; padding: 0.5em 0"
              >
                <transition-group name="card-list" tag="div">
                  <div
                    v-for="card in column.cards"
                    :key="card.id"
                    style="
                      margin-bottom: 12px;
                      margin-left: 10px;
                      margin-right: 10px;
                    "
                  >
                  <div
  class="ui relaxed divided items"
  style="position: relative; margin-bottom: 12px; margin-left: 10px; margin-right: 10px;"
>
<div
  class="item card-item"
  style="
    background: #fff;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start; /* alinhamento horizontal à esquerda */
    position: relative;
    padding-top: 30px;
  "
>
    <!-- Ícones no canto superior direito -->
    <div style="
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 10;
">
  <button
    @click="startEditCard(card)"
    class="ui icon button"
    style="background-color: orange; color: white; padding: 6px; border-radius: 4px;"
    title="Editar"
  >
    <i class="edit icon" style="font-size: 12px;"></i>
  </button>
  <button
    @click="deleteCard(card.id)"
    class="ui icon button"
    style="background-color: red; color: white; padding: 6px; border-radius: 4px;"
    title="Excluir"
  >
    <i class="trash alternate icon" style="font-size: 12px;"></i>
  </button>
</div>
    <div class="content" style="flex: 1; padding: 0">
      <div v-if="editingCard && editingCard.id === card.id" class="ui form">
        <div class="field">
          <input
            type="text"
            v-model="editingCard.title"
            placeholder="Título"
          />
        </div>
        <div class="field">
          <textarea
            v-model="editingCard.description"
            placeholder="Descrição"
          ></textarea>
        </div>
        <div class="ui buttons">
          <button class="ui small green button" @click="submitEditCard">
            <i class="check icon"></i>
          </button>
          <button class="ui small basic button" @click="cancelEditCard">
            <i class="times icon"></i>
          </button>
        </div>
      </div>
      <div v-else>
        <div
          class="header"
          style="
            font-weight: 500;
            color: #333;
            font-size: 0.9rem;
            line-height: 1.3em;
          "
        >
          {{ card.title }}
        </div>
        <div
          class="description"
          style="
            color: #666;
            font-size: 0.8rem;
            margin-top: 4px;
            line-height: 1.4em;
            white-space: pre-wrap;
          "
        >
          {{ card.description }}
        </div>
      </div>
    </div>
  </div>
</div>
                  </div>
                </transition-group>
                <div
                  v-if="column.cards.length === 0"
                  class="ui small message"
                  style="
                    text-align: center;
                    color: #999;
                    background: #f9f9f9;
                    margin: 0 10px;
                  "
                >
                  <i class="info circle icon"></i> Nenhum card nesta coluna
                  ainda.
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Usuário autenticado mas sem board -->
    <transition name="fade-in">
      <div
        v-if="isAuthenticated && !board"
        class="ui middle aligned center aligned grid fullscreen"
        style="
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <div class="column" style="max-width: 450px; text-align: center">
          <h2 class="ui icon header">
            <i class="huge circular teal clipboard outline icon"></i>
            Bem-vindo ao seu Kanban!
          </h2>
          <p style="margin-bottom: 2.5em; color: #666; font-size: 1.1rem">
            Organize suas tarefas, ideias e projetos de forma simples e
            eficiente.<br />
            Vamos começar criando seu primeiro board!
          </p>
          <button
            @click="createBoard"
            class="ui animated fade primary fluid large button"
          >
            <div class="visible content">
              <i class="plus icon"></i> Criar Novo Board
            </div>
            <div class="hidden content">
              Clique aqui para começar! &nbsp;<i class="arrow right icon"></i>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script src="./KanbanBoard.js"></script>
<style src="./KanbanBoard.css" scoped></style>
