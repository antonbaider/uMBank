import { defineStore } from 'pinia';
import { decodeJwt } from 'jose';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.token && !this.isTokenExpired;
        },
        isTokenExpired(state) {
            if (!state.token) return true;
            try {
                const { exp } = decodeJwt(state.token);
                return Date.now() >= exp * 1000;
            } catch {
                return true;
            }
        },
        userRole: (state) => state.user?.role || null,
    },
    actions: {
        async login(username, password) {
            try {
                const response = await api.post('/api/auth/login', { username, password });
                const { token } = response.data.data;
                this.token = token;
                this.user = decodeJwt(token); // Decodes and assigns JWT user data
            } catch (error) {
                throw error;
            }
        },
        async fetchProfile() {
            try {
                const response = await api.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.user = response.data.data;
                // No need to set isAuthenticated here; it's derived from token and token expiration
            } catch (error) {
                console.error('Error fetching profile:', error);
                this.user = null;
                this.token = null; // Clear the token if fetching profile fails
            }
        },
        logout() {
            this.token = null;
            this.user = null;
        },
    },
    persist: true,
});