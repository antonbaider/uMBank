<!-- src/views/Registration.vue -->
<template>
  <div class="registration-page">
    <div class="registration-container" v-if="!registrationSuccess">
      <img src="@/assets/logo.svg" alt="BankApp Logo" class="registration-logo" />
      <h2>Create an Account</h2>

      <!-- Step Indicators -->
      <div class="steps-indicator">
        <div
            v-for="(step, index) in steps"
            :key="index"
            :class="['step', { active: currentStep === index, completed: currentStep > index }]"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <!-- Step Forms -->
      <form @submit.prevent="handleRegister">
        <!-- Step 1: Personal Information -->
        <div v-if="currentStep === 0">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
                :class="{'input-error': touched.firstName && errors.firstName}"
                type="text"
                id="firstName"
                v-model.trim="form.firstName"
                placeholder="Enter your first name"
                @input="validateField('firstName')"
                @blur="handleBlur('firstName')"
                required
            />
            <p class="error-message" v-if="touched.firstName && errors.firstName">{{ errors.firstName }}</p>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
                :class="{'input-error': touched.lastName && errors.lastName}"
                type="text"
                id="lastName"
                v-model.trim="form.lastName"
                placeholder="Enter your last name"
                @input="validateField('lastName')"
                @blur="handleBlur('lastName')"
                required
            />
            <p class="error-message" v-if="touched.lastName && errors.lastName">{{ errors.lastName }}</p>
          </div>

          <button
              type="button"
              class="next-button"
              :disabled="!isStepValid(0)"
              @click="nextStep"
          >
            Next
          </button>
        </div>

        <!-- Step 2: Account Details -->
        <div v-if="currentStep === 1">
          <div class="form-group">
            <label for="username">Username</label>
            <input
                :class="{'input-error': touched.username && errors.username}"
                type="text"
                id="username"
                v-model.trim="form.username"
                placeholder="Choose a username"
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
                v-model="form.password"
                placeholder="Choose a password"
                @input="validateField('password')"
                @blur="handleBlur('password')"
                required
            />
            <p class="error-message" v-if="touched.password && errors.password">{{ errors.password }}</p>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
                :class="{'input-error': touched.email && errors.email}"
                type="email"
                id="email"
                v-model.trim="form.email"
                placeholder="Enter your email address"
                @input="validateField('email')"
                @blur="handleBlur('email')"
                required
            />
            <p class="error-message" v-if="touched.email && errors.email">{{ errors.email }}</p>
          </div>

          <button type="button" class="prev-button" @click="prevStep">
            Previous
          </button>
          <button
              type="button"
              class="next-button"
              :disabled="!isStepValid(1)"
              @click="nextStep"
          >
            Next
          </button>
        </div>

        <!-- Step 3: Additional Information -->
        <div v-if="currentStep === 2">
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
                :class="{'input-error': touched.phone && errors.phone}"
                type="text"
                id="phone"
                v-model.trim="form.phone"
                placeholder="Enter your phone number"
                @input="validateField('phone')"
                @blur="handleBlur('phone')"
                required
            />
            <p class="error-message" v-if="touched.phone && errors.phone">{{ errors.phone }}</p>
          </div>

          <div class="form-group">
            <label for="ssn">SSN</label>
            <input
                :class="{'input-error': touched.ssn && errors.ssn}"
                type="text"
                id="ssn"
                v-model.trim="form.ssn"
                placeholder="Enter your SSN"
                @input="validateField('ssn')"
                @blur="handleBlur('ssn')"
                required
            />
            <p class="error-message" v-if="touched.ssn && errors.ssn">{{ errors.ssn }}</p>
          </div>

          <button type="button" class="prev-button" @click="prevStep">
            Previous
          </button>
          <button
              type="submit"
              class="registration-button"
              :disabled="loading || hasErrors"
          >
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
          <p class="error-message" v-if="formError">{{ formError }}</p>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div class="success-message" v-else>
      <h2>Congratulations!</h2>
      <p>Your account has been created successfully. You are now logged in.</p>
      <router-link to="/dashboard" class="dashboard-link">Go to Dashboard</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.js'; // Import your AuthStore
import { usePopupStore } from '@/stores/popup.js'; // Assuming you have a PopupStore

export default {
  name: 'Registration',
  setup() {
    const loading = ref(false);
    const registrationSuccess = ref(false);
    const currentStep = ref(0);
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

    // Track if fields have been interacted with
    const touched = ref({
      firstName: false,
      lastName: false,
      username: false,
      password: false,
      email: false,
      phone: false,
      ssn: false,
    });

    // Step Definitions
    const steps = [
      { label: 'Personal Information' },
      { label: 'Account Details' },
      { label: 'Additional Information' },
    ];

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
          { rule: (v) => /^[a-zA-Z0-9._-]{3,20}$/.test(v), message: 'Username must be 3-20 characters long and can only contain letters, digits, dots, underscores, and hyphens' },
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

    // Initialize Stores
    const auth = useAuthStore();
    const popup = usePopupStore(); // Assuming you have a PopupStore for managing popups

    // Validate Field Locally
    const validateField = (fieldKey) => {
      const field = fields[fieldKey];
      for (const { rule, message } of field.validation) {
        if (!rule(form.value[fieldKey])) {
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
    };

    // Validate All Fields in Current Step Locally
    const isStepValid = (step) => {
      let valid = true;
      const stepFields = getStepFields(step);
      stepFields.forEach((fieldKey) => {
        if (!validateField(fieldKey)) {
          valid = false;
        }
      });
      return valid;
    };

    // Get Fields for a Given Step
    const getStepFields = (step) => {
      switch (step) {
        case 0:
          return ['firstName', 'lastName'];
        case 1:
          return ['username', 'password', 'email'];
        case 2:
          return ['phone', 'ssn'];
        default:
          return [];
      }
    };

    // Navigate to Next Step
    const nextStep = () => {
      if (currentStep.value < steps.length - 1 && isStepValid(currentStep.value)) {
        currentStep.value += 1;
      }
    };

    // Navigate to Previous Step
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value -= 1;
      }
    };

    // Computed Property to Check If Any Errors Exist
    const hasErrors = computed(() => {
      return Object.keys(errors.value).length > 0;
    });

    // Handle Form Submission
    const handleRegister = async () => {
      loading.value = true;
      formError.value = '';
      // Mark all fields as touched to display any hidden errors
      Object.keys(touched.value).forEach((field) => {
        touched.value[field] = true;
      });
      errors.value = {};

      // Final validation before submission
      let allValid = true;
      Object.keys(fields).forEach((fieldKey) => {
        if (!validateField(fieldKey)) {
          allValid = false;
        }
      });

      if (!allValid) {
        popup.show('Please correct the errors before submitting.', 'error'); // Show popup
        loading.value = false;
        return;
      }

      try {
        const response = await api.post('/api/auth/register', form.value);
        // Assuming the backend returns the registered user's username and password or a token
        // For security, it's better to request the user to login again, but here we'll auto-login

        // Auto-login
        await auth.login(form.value.username, form.value.password);

        // Set registration success to show the success message
        registrationSuccess.value = true;
        popup.show('Registration successful! You are now logged in.', 'success'); // Show popup
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
          // Show popup with error message
          popup.show(formError.value, 'error');
        } else {
          // Log unexpected errors for debugging
          console.error('Registration error:', error);
          formError.value = 'An unexpected error occurred. Please try again later.';
          popup.show(formError.value, 'error');
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      steps,
      currentStep,
      form,
      errors,
      formError,
      loading,
      registrationSuccess,
      fields,
      validateField,
      handleBlur,
      handleRegister,
      nextStep,
      prevStep,
      isStepValid,
      hasErrors,
      touched,
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

.registration-container,
.success-message {
  background-color: var(--secondary-color);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 90%;
  text-align: center;
}

.registration-logo {
  height: 50px;
  margin-bottom: 20px;
}

.registration-container h2,
.success-message h2 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #ccc;
  z-index: -1;
}

.step.completed .step-number,
.step.active .step-number {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.step-label {
  font-size: 0.9rem;
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

/* Red border for errors */
.input-error {
  border-color: #e74c3c !important;
}

.next-button,
.prev-button,
.registration-button {
  width: 48%;
  padding: 12px;
  background-color: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
  margin: 10px 1%;
}

.prev-button {
  background-color: #aaa;
}

.next-button:hover,
.prev-button:hover,
.registration-button:hover {
  background-color: #38c6a1;
  transform: translateY(-2px);
}

.next-button:disabled,
.prev-button:disabled,
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

.dashboard-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color var(--transition-speed) ease;
}

.dashboard-link:hover {
  background-color: #38c6a1;
}
</style>