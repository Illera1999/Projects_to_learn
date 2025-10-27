<script setup>
import { ref } from 'vue'

const emit = defineEmits(["new-task"])

const newTask = ref("");

function addTask() {
    const text = newTask.value.trim()
    if (!text) return
    emit("new-task", { text: text, completed: false })
    newTask.value = "";
}
</script>




<template>
    <!-- Zona de entrada: solo vive en HomeView -->
    <div class="container">
        <form class="row g-2 align-items-center justify-content-center mb-4" @submit.prevent="addTask">
            <div class="col-12 col-md-8">
                <input v-model="newTask" type="text" class="form-control"
                    placeholder="Escribe una nueva tarea y pulsa Enter" />
            </div>
            <div class="col-12 col-md-4 d-grid">
                <button class="btn btn-success" type="submit">Añadir</button>
            </div>
        </form>
    </div>
</template>
<style scoped></style>