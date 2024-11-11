// src/store/auth.js
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
    },
    actions: {
        async login(username, password) {
            try {
                const response = await api.post('/api/auth/login', { username, password });
                const { token } = response.data.data;
                this.token = token;
                this.user = decodeJwt(token);
            } catch (error) {
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
        },
    },
    persist: true,
});