<script setup>



</script>



<template>
    <nav class="navbar navbar-expand-lg bg-success navbar-dark">
        <div class="container-fluid px-4 py-2">
            <a class="navbar-brand" href="#">Gestor de Tareas</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav nav-underline">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tareas Pendientes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tareas Completadas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>



<!-- 
    El estilo se hace aqui dentro por defecto de vue. Scope manteiene el css
    dentro del componente.
-->
<style scoped>

</style>