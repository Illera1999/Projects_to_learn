<script setup>
import TaskList from '@/components/TaskList/TaskList.vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Gestor de Tareas</h1>
        <TaskList class="mb-4" :tasks=tasks></TaskList>
    </div>
</template>

<style scoped>
.tasklist-wrapper {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 15px;
}
</style>