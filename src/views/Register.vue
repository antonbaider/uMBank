<template>
  <div class="registration-page">
    <div class="registration-container" v-if="!registrationSuccess">
      <img src="@/assets/logo.svg" alt="BankApp Logo" class="registration-logo" />
      <h2>Create an Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group" v-for="(field, label) in fields" :key="label">
          <label :for="label">{{ field.label }}</label>
          <input
              :type="field.type"
              :id="label"
              v-model="form[label]"
              :placeholder="field.placeholder"
              required
          />
          <p class="error-message" v-if="errors[label]">{{ errors[label] }}</p>
        </div>
        <button type="submit" class="registration-button">
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
        <p class="error-message" v-if="formError">{{ formError }}</p>
      </form>
    </div>

    <!-- Success Message -->
    <div class="success-message" v-else>
      <h2>Congratulations!</h2>
      <p>Your account has been created successfully. You can now proceed to login.</p>
      <router-link to="/login" class="login-link">Go to Login</router-link>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import api from '@/services/api';

export default {
  name: 'Registration',
  setup() {
    const loading = ref(false);
    const registrationSuccess = ref(false);
    const form = ref({
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      ssn: '',
    });
    const errors = ref({});
    const formError = ref('');

    const fields = {
      firstName: {label: 'First Name', type: 'text', placeholder: 'Enter your first name'},
      lastName: {label: 'Last Name', type: 'text', placeholder: 'Enter your last name'},
      username: {label: 'Username', type: 'text', placeholder: 'Choose a username'},
      password: {label: 'Password', type: 'password', placeholder: 'Choose a password'},
      email: {label: 'Email', type: 'email', placeholder: 'Enter your email address'},
      phone: {label: 'Phone', type: 'text', placeholder: 'Enter your phone number'},
      ssn: {label: 'SSN', type: 'text', placeholder: 'Enter your SSN'},
    };

    const handleRegister = async () => {
      loading.value = true;
      formError.value = '';
      errors.value = {};
      try {
        const response = await api.post('/api/auth/register', form.value);
        registrationSuccess.value = true; // Show success message on successful registration
      } catch (error) {
        if (error.response && error.response.data) {
          const {message, details} = error.response.data;
          formError.value = message || 'Registration failed. Please try again.';

          if (details && typeof details === 'object') {
            for (const [key, msg] of Object.entries(details)) {
              if (form.value[key] !== undefined) {
                errors.value[key] = msg || 'Invalid input';
              }
            }
          }
        } else {
          formError.value = 'An unexpected error occurred.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      fields,
      form,
      errors,
      formError,
      loading,
      registrationSuccess,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--navbar-height) - var(--footer-height));
}

.registration-container, .success-message {
  background-color: var(--secondary-color);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.registration-logo {
  height: 50px;
  margin-bottom: 20px;
}

.registration-container h2, .success-message h2 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color var(--transition-speed) ease;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.registration-button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
}

.registration-button:hover {
  background-color: #38c6a1;
  transform: translateY(-2px);
}

.registration-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
}

.success-message p {
  font-size: 1rem;
  color: var(--text-color);
  margin: 20px 0;
}

.login-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color var(--transition-speed) ease;
}

.login-link:hover {
  background-color: #38c6a1;
}
</style>