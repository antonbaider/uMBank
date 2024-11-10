<!-- src/App.vue -->
<template>
  <div id="app">

    <!-- Navigation Bar -->
    <header class="navbar">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="BankApp Logo" class="logo" />
        <router-link to="/" class="nav-link">BankApp</router-link>
      </div>
      <button class="hamburger" @click="toggleMenu" aria-label="Toggle Navigation">
        <i :class="menuIcon"></i>
      </button>
      <nav :class="['nav-links', { 'active': isMenuActive }]">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link">Register</router-link>
        <router-link v-if="isLoggedIn" to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link v-if="isLoggedIn" to="/accounts" class="nav-link">Accounts</router-link>
        <router-link v-if="isLoggedIn" to="/payment" class="nav-link">Payment</router-link>
        <router-link v-if="isLoggedIn" to="/support" class="nav-link">Support</router-link>
      </nav>
      <div class="auth-section">
        <span v-if="isLoggedIn" class="user-info">
        <router-link to="/profile" class="welcome-text">Hi, {{ userName }}!</router-link>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </span>
        <router-link v-else to="/login" class="login-button">Login</router-link>
      </div>
    </header>
    <!-- Main Content -->
    <main class="main-content">
      <router-view/>
      <Popup />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2024 BankApp. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import Payment from "@/views/Payment.vue";
import Popup from "@/components/Popup.vue";

export default {
  components: {Payment,  Popup},
  setup() {
    const auth = useAuthStore();
    const isLoggedIn = computed(() => auth.isLoggedIn);
    const userName = computed(() => auth.userName);

    const handleLogout = () => {
      auth.logout();
    };

    return {
      isLoggedIn,
      userName,
      handleLogout,
    };
  },
};
</script>

<style>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

/* CSS Variables for Theming */
:root {
  --primary-color: #4A90E2;
  --secondary-color: #FFFFFF;
  --accent-color: #50E3C2;
  --background-color: #F5F7FA;
  --text-color: #333333;
  --navbar-height: 70px;
  --footer-height: 60px;
  --transition-speed: 0.3s;
}

.dark-mode {
  --primary-color: #1E293B;
  --secondary-color: #111827;
  --accent-color: #aceafa;
  --background-color: #0F172A;
  --text-color: #F9FAFB;
}

/* Global Styles */
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navigation Bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--navbar-height);
  padding: 0 30px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 15px;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  margin: 0 15px;
  font-weight: 600;
  color: var(--secondary-color);
  text-decoration: none;
  position: relative;
  transition: color var(--transition-speed) ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--secondary-color);
  transition: width var(--transition-speed) ease;
}

.nav-link:hover {
  color: var(--accent-color);
}

.nav-link:hover::after {
  width: 100%;
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.welcome-text {
  margin-right: 15px;
  font-weight: 600;
  color: white;
}

.logout-button {
  padding: 8px 16px;
  background-color: var(--accent-color);
  border: none;
  border-radius: 25px;
  color: var(--secondary-color);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
}

.logout-button:hover {
  background-color: #38c6a1; /* Slightly darker accent color */
  transform: translateY(-2px);
}

.login-button {
  padding: 8px 16px;
  background-color: var(--accent-color);
  border: none;
  border-radius: 25px;
  color: var(--secondary-color);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
}

.login-button:hover {
  background-color: #38c6a1; /* Slightly darker accent color */
  transform: translateY(-2px);
}

/* Hamburger Menu Styles */
.hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color var(--transition-speed) ease;
}

.hamburger:hover {
  color: var(--accent-color);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px 30px;
  background: url('@/assets/background.svg') no-repeat center center fixed;
  background-size: cover;
  box-sizing: border-box;
  transition: background-color var(--transition-speed) ease;
}

/* Footer */
.footer {
  height: var(--footer-height);
  background-color: var(--secondary-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.dark-mode .footer {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    display: none;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-link {
    margin: 10px 0;
  }

  .auth-section {
    margin-top: 15px;
  }

  .main-content {
    padding: 20px 15px;
  }

  .hamburger {
    display: block;
  }
}

/* Utility Classes */
button, .login-button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode button, .dark-mode .login-button {
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatUp {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>