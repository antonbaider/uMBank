<!-- src/views/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <img src="@/assets/logo.svg" alt="BankApp Logo" class="login-logo" />
      <h2>Login to Your Account</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Enter your username"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
          />
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';

export default {
  name: 'Login',
  setup() {
    const auth = useAuthStore();
    const username = ref('');
    const password = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      loading.value = true;
      try {
        await auth.login(username.value, password.value);
        // Redirect handled in the store
      } catch (error) {
        // Error handling already done in the store
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      handleLogin,
      loading,
    };
  },
};
</script>

<style scoped>
/* Global Box Sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--navbar-height, 60px) - var(--footer-height, 40px));
  padding: 20px; /* Prevent overflow on small screens */
}

.login-container {
  background-color: var(--secondary-color, #f9f9f9);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
  transition: background-color var(--transition-speed, 0.3s) ease,
  color var(--transition-speed, 0.3s) ease;
}

.login-logo {
  height: 50px;
  margin-bottom: 20px;
}

.login-container h2 {
  margin-bottom: 30px;
  color: var(--text-color, #333333);
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color, #333333);
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color var(--transition-speed, 0.3s) ease;
}

.form-group input:focus {
  border-color: var(--primary-color, #4caf50);
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color, #4caf50);
  color: var(--secondary-color, #f9f9f9);
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed, 0.3s) ease,
  transform var(--transition-speed, 0.3s) ease;
}

.login-button:hover {
  background-color: #38c6a1; /* Slightly darker primary color */
  transform: translateY(-2px);
}

.login-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }

  .login-logo {
    height: 40px;
    margin-bottom: 15px;
  }

  .login-container h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .login-button {
    padding: 10px;
    font-size: 1rem;
  }
}
</style>