<template>
  <div class="kanban-container">
    <transition name="fade-in">
      <div v-if="!board" 
          class="ui middle aligned center aligned grid fullscreen" 
          style="min-height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div class="column" style="max-width: 450px; text-align: center;">
          <h2 class="ui icon header">
            <i class="huge circular teal clipboard outline icon"></i>
            Bem-vindo ao seu Kanban!
          </h2>
          <p style="margin-bottom: 2.5em; color: #666; font-size: 1.1rem;">
            Organize suas tarefas, ideias e projetos de forma simples e eficiente.<br>
            Vamos começar criando seu primeiro board!
          </p>
          <button @click="createBoard" class="ui animated fade primary fluid large button">
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

    <div v-if="board" class="ui container" style="margin-top: 3em; margin-bottom: 3em;">
      <div class="ui center aligned header board-title">
        <h1 style="margin-bottom: 0.2em;">
          {{ board.name }}
        </h1>
        <div class="sub header" style="color: #777; font-size: 1.1rem;">
          Gerencie suas colunas e cards aqui
        </div>
      </div>

      <div class="ui centered stackable four column grid" 
     style="margin-top: 2.5em; max-width: 80%; margin-left: auto; margin-right: auto;">
        <transition-group name="column-fade">
          <div v-for="column in board.columns" :key="column.id" class="column" style="box-shadow: none;">
  <div class="ui fluid card column-card">
    <div class="content column-header" 
         :style="{ 
           background: getColumnColor(column.id), 
           color: '#fff', 
           padding: '12px 16px', 
           borderTopLeftRadius: '6px', 
           borderTopRightRadius: '6px'
         }">
      <div class="header" style="font-size: 1.1rem; font-weight: 600; color: #fff;">
        {{ column.name }}
      </div>
      <div class="meta" style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
        {{ column.cards.length }} cards
                </div>
              </div>

              <div class="content">
                <transition name="form-fade">
                  <div v-if="isFormVisible(column.id)" class="ui form">
                    <div class="field">
                      <label style="font-weight: 500;">Título do card</label>
                      <input type="text" v-model="newCard.title" placeholder="Ex: Reunião às 15h" autofocus>
                    </div>
                    <div class="field">
                      <label style="font-weight: 500;">Descrição</label>
                      <textarea rows="3" v-model="newCard.description" placeholder="Detalhes do card"></textarea>
                    </div>
                    <div class="ui two small buttons">
                      <button @click="submitCard(column.id)" class="ui secondary button" :disabled="!newCard.title.trim()">
                        <i class="save icon"></i> Salvar
                      </button>
                      <button @click="cancelCard" class="ui button">
                        <i class="times icon"></i> Cancelar
                      </button>
                    </div>
                  </div>
                </transition>

                <div class="ui form">
  </div>

  <button @click="showCardForm(column.id)" class="ui fluid tiny blue animated button" style="margin-top: 10px;">
    <div class="visible content">
      <i class="plus icon"></i> Novo Card
    </div>
    <div class="hidden content">
      Adicionar &nbsp;<i class="arrow down icon"></i>
    </div>
  </button>
              </div>

              <div class="content card-list" style="max-height: 450px; overflow-y: auto; padding: 0.5em 0;">
                <transition-group name="card-list">
                  <div v-for="card in column.cards" :key="card.id" 
                    style="margin-bottom: 12px; margin-left: 10px; margin-right: 10px;">
                  <div class="ui relaxed divided items">
                    <div class="item card-item" style="
                          background: #ffffff; 
                          padding: 10px 12px; 
                          border-radius: 6px; 
                          border: 1px solid #e0e0e0; 
                          box-shadow: 0 1px 3px rgba(0,0,0,0.08); 
                          display: flex; 
                          align-items: flex-start;">
                      <div style="margin-right: 8px; margin-top: 2px;">
                        <i class="sticky note outline icon" style="color: #4CAF50; font-size: 1.1em;"></i>
                      </div>
                      <div class="content" style="flex: 1; padding: 0;">
                        <div class="header" style="font-weight: 500; color: #333; font-size: 0.9rem; line-height: 1.3em;">
                          {{ card.title }}
                        </div>
                        <div class="description" style="color: #666; font-size: 0.8rem; margin-top: 4px; line-height: 1.4em; white-space: pre-wrap;">
                          {{ card.description }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </transition-group>
                <div v-if="column.cards.length === 0" class="ui small message" style="text-align: center; color: #999; background: #f9f9f9; margin: 0px 10px;">
                  <i class="info circle icon"></i> Nenhum card nesta coluna ainda.
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>



<script src="./KanbanBoard.js"></script>
<style src="./KanbanBoard.css" scoped></style>
