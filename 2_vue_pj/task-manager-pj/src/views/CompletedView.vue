<script setup>
import { computed } from 'vue';
import TaskList from '@/components/TaskList/TaskList.vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
})
const competedTask = computed(function()
{
    return props.tasks.filter((t) => t.completed);
})
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Gestor de Tareas Completadas</h1>
        <TaskList class="mb-4" :tasks=competedTask></TaskList>
    </div>
</template>

<style scoped>
.tasklist-wrapper {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 15px;
}
</style>