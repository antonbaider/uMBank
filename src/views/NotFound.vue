<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/">Go Back Home</router-link>
  </div>
</template>

<script>
// src/views/NotFound.vue
export default {
  name: 'NotFound'
};
</script>

<style scoped>
/* src/views/NotFound.vue */
/* Add your styles here */
.not-found-container {
  text-align: center;
  margin-top: 100px;
}

.not-found-container h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

.not-found-container p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.not-found-container a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.not-found-container a:hover {
  text-decoration: underline;
}
</style>