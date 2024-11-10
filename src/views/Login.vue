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
              :class="{'input-error': touched.username && errors.username}"
              type="text"
              id="username"
              v-model="username"
              placeholder="Enter your username"
              @input="validateField('username')"
              @blur="handleBlur('username')"
              required
          />
          <p class="error-message" v-if="touched.username && errors.username">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
              :class="{'input-error': touched.password && errors.password}"
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              @input="validateField('password')"
              @blur="handleBlur('password')"
              required
          />
          <p class="error-message" v-if="touched.password && errors.password">{{ errors.password }}</p>
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <!-- Popup Component is globally included in App.vue -->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { usePopupStore } from '@/stores/popup.js';

export default {
  name: 'Login',
  setup() {
    const auth = useAuthStore(); // Initialize AuthStore
    const popup = usePopupStore(); // Initialize PopupStore if using popups
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const errors = ref({});
    const touched = ref({
      username: false,
      password: false,
    });

    // Field Definitions and Validation Patterns
    const fields = {
      username: {
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
        validation: [
          { rule: (v) => !!v, message: 'Username is required' },
        ],
      },
      password: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        validation: [
          { rule: (v) => !!v, message: 'Password is required' },
        ],
      },
    };

    // Validate Field Locally
    const validateField = (fieldKey) => {
      const field = fields[fieldKey];
      if (!field.validation) return true;
      for (const { rule, message } of field.validation) {
        const value = fieldKey === 'username' ? username.value : password.value;
        if (!rule(value)) {
          errors.value[fieldKey] = message;
          return false;
        }
      }
      delete errors.value[fieldKey];
      return true;
    };

    // Handle Field Blur
    const handleBlur = (fieldKey) => {
      touched.value[fieldKey] = true;
      validateField(fieldKey);
    };

    // Handle Login
    const handleLogin = async () => {
      loading.value = true;
      errors.value = {};

      // Mark all fields as touched
      Object.keys(touched.value).forEach((field) => {
        touched.value[field] = true;
        validateField(field);
      });

      // Check for validation errors
      if (Object.keys(errors.value).length > 0) {
        popup.show('Please fill in all required fields.', 'error'); // Show popup
        loading.value = false;
        return;
      }

      try {
        await auth.login(username.value, password.value);
        // Redirect handled in the AuthStore
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          popup.show(message || 'Login failed. Please check your credentials.', 'error');
        } else {
          console.error('Login error:', error);
          popup.show('Invalid username or password', 'error');
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      handleLogin,
      loading,
      errors,
      touched,
      validateField,
      handleBlur,
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

/* Red border for errors */
.input-error {
  border-color: #e74c3c !important;
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

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
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