<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar/NavBar.vue';
import NewTask from '@/components/NewTask/NewTask.vue';


const tasks = ref([
    { text: 'Uno', completed: false },
    { text: 'Dos', completed: false },
    { text: 'Tres', completed: false },
    { text: 'Cuatro', completed: false }
])

function handleNewTask(newTask) {
    tasks.value.push(newTask)
}
</script>

<template>
  <div>
    <NavBar></NavBar>
    <RouterView :tasks=tasks></RouterView>
    <NewTask v-on:new-task="handleNewTask"></NewTask>
  </div>

</template>

<style scoped></style>
