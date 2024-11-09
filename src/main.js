// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import vuetify from './plugins/vuetify';
import 'vuetify/styles';
import './main.css';
import './assets/styles.css'; // Import global styles
// src/main.js
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

// Import Tailwind CSS

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(createPinia());
pinia.use(piniaPluginPersistedstate);
app.use(router);

app.mount('#app');