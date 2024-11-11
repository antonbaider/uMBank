// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './main.css';
import './assets/styles.css'; // Import global styles
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import {useAuthStore} from "@/stores/auth.js";
import VueTheMask from 'vue-the-mask';

// Create and export the pinia instance

const app = createApp(App);
app.use(VueTheMask);
app.use(pinia);
app.use(router);

// Initialize auth store and fetch profile before mounting the app
const authStore = useAuthStore();

authStore.fetchProfile().then(() => {
    app.mount('#app');
}).catch(() => {
    // Even if fetching profile fails, mount the app to allow navigation to Login/Register
    app.mount('#app');
});