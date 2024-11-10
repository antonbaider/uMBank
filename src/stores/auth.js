// src/stores/auth.js
import { defineStore } from 'pinia';
import { decodeJwt } from 'jose';
import api from '@/services/api.js';
import router from '@/router';
import popup from "@/components/Popup.vue";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('tokens') || null,
        user: null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user,
        userName: (state) => (state.user && state.user.sub) ? state.user.sub : 'User',
    },
    actions: {
        /**
         * Logs in the user by sending credentials to the backend.
         * Stores the received token and decodes it to get user info.
         * Redirects to Dashboard upon successful login.
         * @param {string} username
         * @param {string} password
         */
        async login(username, password) {
            try {
                const response = await api.post('/api/auth/login', { username, password });
                console.log('Login Response:', response.data);

                if (response.data && response.data.data && response.data.data.token) {
                    const token = response.data.data.token;
                    this.token = token;
                    localStorage.setItem('tokens', token);
                    this.user = decodeJwt(token);
                    console.log('Decoded User:', this.user);

                    // Redirect to Dashboard
                    router.push({ name: 'Dashboard' }).catch((err) => {
                        if (err.name !== 'NavigationDuplicated') {
                            console.error('Router push error:', err);
                        }
                    });
                } else {
                    console.error('No token found in response');
                    popup.show('Invalid credentials.');
                }
            } catch (error) {
                if (error.response) {
                    console.error('Login Error:', error.response.data);
                    popup.show(`Login failed: ${error.response.data.message || 'Invalid credentials.'}`);
                } else {
                    console.error('Login Error:', error.message);
                    popup.show('Login failed: Server error.');
                }
                throw error;
            }
        },

        /**
         * Logs out the user by removing the token and redirecting to the login page.
         */
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('tokens');
            router.push({ name: 'Login' }).catch((err) => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('Router push error:', err);
                }
            });
        },

        /**
         * Retrieves the token from state.
         * @returns {string|null}
         */
        getToken() {
            return this.token;
        },

        // **Removed the conflicting 'isLoggedIn' action**
        // If you have other actions, keep them here without naming conflicts.
    },
    persist: true,
});

export default useAuthStore;