// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './main.css';
import './assets/styles.css'; // Import global styles
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

// Create and export the pinia instance

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');