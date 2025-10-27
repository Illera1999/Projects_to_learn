<script setup>
const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
})
</script>


<template>
    <ul class="tasklist-wrapper list-group">
        <li v-for="(task, index) in tasks" :key="index" class="list-group-item">
            <input class="form-check-input" type="checkbox" :id="index" v-model="task.completed">
            <label class="form-check-label" :for="index">
                <span v-if="task.completed" class="completed">
                    {{ task.text }}
                </span>
                <span v-else>
                    {{ task.text }}
                </span>
            </label>
        </li>
    </ul>
</template>


<style scoped>
.completed {
    text-decoration: line-through;
    color: grey;
}

.form-check-input {
    margin-right: 10px;
}

.form-check-label {
    cursor: pointer;
    font-size: 1.1rem;
}

.list-group-item {
    font-size: 1.2rem;
    padding: 1rem 1.5rem;
}
</style>