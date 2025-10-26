<script setup>
import TaskList from '@/components/TaskList/TaskList.vue';

</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Gestor de Tareas</h1>
        <TaskList></TaskList>
    </div>
</template>

<style>
.tasklist-wrapper {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 15px;
}
</style>