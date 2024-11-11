// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import Accounts from '@/views/Accounts.vue';
import Payment from '@/views/Payment.vue';
import Profile from '@/views/Profile.vue';
import Support from '@/views/Support.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/accounts',
        name: 'Accounts',
        component: Accounts,
        meta: { requiresAuth: true },
    },
    {
        path: '/payment',
        name: 'Pay',
        component: Payment,
        meta: { requiresAuth: true },
    },
    {
        path: '/support',
        name: 'Support',
        component: Support,
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Updated navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirect unauthenticated users to the Login page
        next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (
        (to.name === 'Login' || to.name === 'Register') &&
        authStore.isAuthenticated
    ) {
        // Redirect authenticated users away from Login and Register pages
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router;