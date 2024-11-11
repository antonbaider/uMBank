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
import AdminPanel from "@/views/AdminPanel.vue";

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/accounts', name: 'Accounts', component: Accounts, meta: { requiresAuth: true } },
    { path: '/payment', name: 'Pay', component: Payment, meta: { requiresAuth: true } },
    { path: '/support', name: 'Support', component: Support, meta: { requiresAuth: true } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/admin', name: 'AdminPanel', component: AdminPanel, meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard with role-based access check
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    console.log("Attempting to navigate to:", to.name);
    console.log("Authenticated:", authStore.isAuthenticated);
    console.log("User Role:", authStore.userRole);

    // Check authentication requirement
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        console.log("Redirecting to Login: User not authenticated");
        return next({ name: 'Login', query: { redirect: to.fullPath } });
    }

    // Check role-based access for routes with specific role requirements
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
        console.error(`Access denied: User role ${authStore.userRole} does not have permission to access ${to.name}`);
        return next({ name: 'Home' });
    }

    // Redirect authenticated users away from Login and Register pages
    if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
        console.log("Redirecting to Dashboard: User already authenticated");
        return next({ name: 'Dashboard' });
    }

    // Allow navigation
    next();
});

export default router;