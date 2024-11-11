<!-- src/views/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <img
          src="@/assets/logo.svg"
          alt="BankApp Logo"
          class="login-logo"
          :class="{ spinning: isSpinning }"
      />
      <h2>Login to Your Account</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
              :class="{ 'input-error': touched.username && errors.username }"
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
              :class="{ 'input-error': touched.password && errors.password }"
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
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { usePopupStore } from '@/stores/popup';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const errors = reactive({});
    const touched = reactive({
      username: false,
      password: false,
    });

    const isSpinning = ref(false);

    const authStore = useAuthStore();
    const popupStore = usePopupStore();
    const router = useRouter();

    const fields = {
      username: {
        label: 'Username',
        validation: [{ rule: (v) => !!v, message: 'Username is required' }],
      },
      password: {
        label: 'Password',
        validation: [{ rule: (v) => !!v, message: 'Password is required' }],
      },
    };

    const validateField = (fieldKey) => {
      const field = fields[fieldKey];
      const value = fieldKey === 'username' ? username.value : password.value;
      for (const { rule, message } of field.validation) {
        if (!rule(value)) {
          errors[fieldKey] = message;
          return false;
        }
      }
      delete errors[fieldKey];
      return true;
    };

    const handleBlur = (fieldKey) => {
      touched[fieldKey] = true;
      validateField(fieldKey);
    };

    const handleLogin = async () => {
      loading.value = true;
      isSpinning.value = true; // Start logo spinning when login is attempted

      // Validate all fields
      let isValid = true;
      for (const fieldKey in fields) {
        touched[fieldKey] = true;
        if (!validateField(fieldKey)) {
          isValid = false;
        }
      }

      if (!isValid) {
        loading.value = false;
        isSpinning.value = false; // Stop spinning if validation fails
        return;
      }

      try {
        await authStore.login(username.value, password.value);
        const redirect = router.currentRoute.value.query.redirect || '/dashboard';
        router.push(redirect);
      } catch (error) {
        // Use the popup to display the error message
        popupStore.show('Invalid username or password', 'error');
      } finally {
        loading.value = false;
        // Stop spinning after the animation completes
        setTimeout(() => {
          isSpinning.value = false;
        }, 1500); // Duration of the spin animation in milliseconds
      }
    };

    return {
      username,
      password,
      loading,
      errors,
      touched,
      validateField,
      handleBlur,
      handleLogin,
      isSpinning,
    };
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  /* You can customize the background if needed */
}

.login-container {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
  transition: transform 0.3s ease;
}

.login-logo {
  height: 50px;
  margin-bottom: 25px;
  cursor: pointer;
}

.login-logo:hover:not(.spinning) {
  animation: spinAnimationHover 1s forwards;
}

@keyframes spinAnimationHover {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-logo.spinning {
  animation: spinAnimation 1s forwards;
}

@keyframes spinAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

h2 {
  margin-bottom: 20px;
  color: #4a90e2;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  outline: none;
}

.input-error {
  border-color: #e74c3c !important;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
}

.login-button:hover {
  background-color: #357abd;
  box-shadow: 0 6px 15px rgba(74, 144, 226, 0.4);
  transform: translateY(-2px);
}

.login-button:disabled {
  background-color: #a5c8e7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>