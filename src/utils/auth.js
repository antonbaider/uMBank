// src/utils/auth.js
import { useAuthStore } from '@/stores/auth';

export function isAuthenticated() {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
}