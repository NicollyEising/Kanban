<template>
  <div id="app">
    <KanbanBoard />
  </div>
</template>

<script>
import KanbanBoard from './KanbanBoard.vue';

export default {
  name: 'App',
  components: {
    KanbanBoard,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
