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
              @input="validateField(label)"
              @blur="serverValidateField(label)"
              required
          />
          <p class="error-message" v-if="errors[label]">{{ errors[label] }}</p>
        </div>
        <button type="submit" class="registration-button" :disabled="loading || Object.keys(errors).length > 0">
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
import { ref } from 'vue';
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

    // Field Definitions and Validation Patterns
    const fields = {
      firstName: {
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name',
        validation: [
          { rule: (v) => !!v, message: 'First name is required' },
          { rule: (v) => /^[A-Za-z]+$/.test(v), message: 'First name must contain only letters' },
          { rule: (v) => v.length >= 2 && v.length <= 50, message: 'First name must be between 2 and 50 characters' },
        ],
      },
      lastName: {
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name',
        validation: [
          { rule: (v) => !!v, message: 'Last name is required' },
          { rule: (v) => /^[A-Za-z]+$/.test(v), message: 'Last name must contain only letters' },
          { rule: (v) => v.length >= 2 && v.length <= 50, message: 'Last name must be between 2 and 50 characters' },
        ],
      },
      username: {
        label: 'Username',
        type: 'text',
        placeholder: 'Choose a username',
        validation: [
          { rule: (v) => !!v, message: 'Username is required' },
          { rule: (v) => /^[a-zA-Z0-9._-]{3,20}$/.test(v), message: 'Invalid username format' },
          { rule: (v) => v.length >= 5 && v.length <= 50, message: 'Username must be between 5 and 50 characters' },
        ],
      },
      password: {
        label: 'Password',
        type: 'password',
        placeholder: 'Choose a password',
        validation: [
          { rule: (v) => !!v, message: 'Password is required' },
          { rule: (v) => v.length >= 8 && v.length <= 50, message: 'Password must be between 8 and 50 characters' },
          { rule: (v) => /[0-9]/.test(v), message: 'Password must contain at least one number' },
          { rule: (v) => /[@$!%*?&#]/.test(v), message: 'Password must contain at least one special character' },
        ],
      },
      email: {
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email address',
        validation: [
          { rule: (v) => !!v, message: 'Email is required' },
          { rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email format' },
        ],
      },
      phone: {
        label: 'Phone',
        type: 'text',
        placeholder: 'Enter your phone number',
        validation: [
          { rule: (v) => !!v, message: 'Phone number is required' },
          { rule: (v) => /^[0-9]{10,15}$/.test(v), message: 'Phone number must be between 10 and 15 digits' },
        ],
      },
      ssn: {
        label: 'SSN',
        type: 'text',
        placeholder: 'Enter your SSN',
        validation: [
          { rule: (v) => !!v, message: 'SSN is required' },
          { rule: (v) => /^(?!000|666|9\d\d)(\d{3})(?!00)(\d{2})(?!0000)(\d{4})$/.test(v), message: 'Invalid SSN format' },
        ],
      },
    };

    // Validate Field Locally
    const validateField = (fieldKey) => {
      const field = fields[fieldKey];
      for (const { rule, message } of field.validation) {
        if (!rule(form.value[fieldKey])) {
          errors.value[fieldKey] = message;
          return;
        }
      }
      delete errors.value[fieldKey];
    };

    // Validate Field with Server
    const serverValidateField = async (fieldKey) => {
      if (!form.value[fieldKey]) return;
      try {
        await api.post(`/api/auth/validate/${fieldKey}`, { [fieldKey]: form.value[fieldKey] });
      } catch (error) {
        if (error.response && error.response.data) {
          errors.value[fieldKey] = error.response.data.message || 'Invalid input';
        }
      }
    };

    // Handle Form Submission
    const handleRegister = async () => {
      loading.value = true;
      formError.value = '';
      errors.value = {};
      try {
        const response = await api.post('/api/auth/register', form.value);
        registrationSuccess.value = true; // Show success message on successful registration
      } catch (error) {
        if (error.response && error.response.data) {
          const { message, details } = error.response.data;
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
      validateField,
      serverValidateField,
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