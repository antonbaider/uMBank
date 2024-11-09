<!-- src/views/Registration.vue -->
<template>
  <div class="registration-page">
    <div class="registration-container">
      <img src="@/assets/logo.svg" alt="BankApp Logo" class="registration-logo" />
      <h2>Create an Account</h2>

      <!-- Step Indicators -->
      <div class="steps">
        <div
            class="step"
            :class="{ active: currentStep === 1 }"
        >
          1
        </div>
        <div
            class="step"
            :class="{ active: currentStep === 2 }"
        >
          2
        </div>
        <div
            class="step"
            :class="{ active: currentStep === 3 }"
        >
          3
        </div>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="form-step">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
                type="text"
                id="firstName"
                v-model="form.firstName"
                placeholder="Enter your first name"
                required
                :aria-invalid="errors.firstName ? 'true' : 'false'"
                aria-describedby="firstNameError"
            />
            <p id="firstNameError" class="error-message" v-if="errors.firstName">{{ errors.firstName }}</p>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
                type="text"
                id="lastName"
                v-model="form.lastName"
                placeholder="Enter your last name"
                required
                :aria-invalid="errors.lastName ? 'true' : 'false'"
                aria-describedby="lastNameError"
            />
            <p id="lastNameError" class="error-message" v-if="errors.lastName">{{ errors.lastName }}</p>
          </div>
          <div class="navigation-buttons">
            <button type="button" @click="nextStep" class="next-button">Next</button>
          </div>
        </div>

        <!-- Step 2: Account Details -->
        <div v-if="currentStep === 2" class="form-step">
          <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="username"
                v-model="form.username"
                placeholder="Choose a username"
                required
                :aria-invalid="errors.username ? 'true' : 'false'"
                aria-describedby="usernameError"
            />
            <p id="usernameError" class="error-message" v-if="errors.username">{{ errors.username }}</p>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                v-model="form.password"
                placeholder="Choose a password"
                required
                :aria-invalid="errors.password ? 'true' : 'false'"
                aria-describedby="passwordError"
            />
            <p id="passwordError" class="error-message" v-if="errors.password">{{ errors.password }}</p>
          </div>
          <div class="navigation-buttons">
            <button type="button" @click="prevStep" class="back-button">Back</button>
            <button type="button" @click="nextStep" class="next-button">Next</button>
          </div>
        </div>

        <!-- Step 3: Contact Information -->
        <div v-if="currentStep === 3" class="form-step">
          <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                v-model="form.email"
                placeholder="Enter your email address"
                required
                :aria-invalid="errors.email ? 'true' : 'false'"
                aria-describedby="emailError"
            />
            <p id="emailError" class="error-message" v-if="errors.email">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
                type="text"
                id="phone"
                v-model="form.phone"
                placeholder="Enter your phone number"
                required
                :aria-invalid="errors.phone ? 'true' : 'false'"
                aria-describedby="phoneError"
            />
            <p id="phoneError" class="error-message" v-if="errors.phone">{{ errors.phone }}</p>
          </div>
          <div class="form-group">
            <label for="ssn">SSN</label>
            <input
                type="text"
                id="ssn"
                v-model="form.ssn"
                placeholder="Enter your SSN"
                required
                :aria-invalid="errors.ssn ? 'true' : 'false'"
                aria-describedby="ssnError"
            />
            <p id="ssnError" class="error-message" v-if="errors.ssn">{{ errors.ssn }}</p>
          </div>
          <div class="navigation-buttons">
            <button type="button" @click="prevStep" class="back-button">Back</button>
            <button type="submit" class="register-button" :disabled="loading">
              <span v-if="loading">Registering...</span>
              <span v-else>Register</span>
            </button>
          </div>
          <p class="error-message" v-if="formError">{{ formError }}</p>
        </div>
      </form>

      <!-- Success Message -->
      <div class="success-message" v-if="registrationSuccess">
        <h2>Congratulations!</h2>
        <p>Your account has been created successfully. You can now proceed to login.</p>
        <router-link to="/login" class="login-link">Go to Login</router-link>
      </div>
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
    const currentStep = ref(1);
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
                // Determine which step the invalid field belongs to
                const step = getStepForField(key);
                if (step < currentStep.value) {
                  currentStep.value = step;
                }
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

    const nextStep = () => {
      // Basic Validation before moving to next step
      if (currentStep.value === 1) {
        if (!form.value.firstName.trim()) {
          errors.value.firstName = 'First name is required.';
          return;
        }
        if (!form.value.lastName.trim()) {
          errors.value.lastName = 'Last name is required.';
          return;
        }
      }

      if (currentStep.value === 2) {
        if (!form.value.username.trim()) {
          errors.value.username = 'Username is required.';
          return;
        }
        if (!form.value.password.trim()) {
          errors.value.password = 'Password is required.';
          return;
        }
        // Additional password strength validation can be added here
      }

      // Clear errors for the current step
      clearStepErrors(currentStep.value);

      if (currentStep.value < 3) {
        currentStep.value += 1;
      }
    };

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value -= 1;
      }
    };

    const getStepForField = (field) => {
      const stepMapping = {
        firstName: 1,
        lastName: 1,
        username: 2,
        password: 2,
        email: 3,
        phone: 3,
        ssn: 3,
      };
      return stepMapping[field] || 1;
    };

    const clearStepErrors = (step) => {
      const stepFields = {
        1: ['firstName', 'lastName'],
        2: ['username', 'password'],
        3: ['email', 'phone', 'ssn'],
      };
      stepFields[step].forEach((field) => {
        if (errors.value[field]) {
          delete errors.value[field];
        }
      });
    };

    return {
      form,
      errors,
      formError,
      loading,
      registrationSuccess,
      handleRegister,
      currentStep,
      nextStep,
      prevStep,
    };
  },
};
</script>

<style scoped>
/* Page Container */
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--navbar-height, 60px) - var(--footer-height, 40px));
  padding: 20px; /* Prevent overflow on smaller screens */
}

/* Registration Container */
.registration-container {
  background-color: var(--secondary-color, #f9f9f9);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
  transition: background-color var(--transition-speed, 0.3s) ease,
  color var(--transition-speed, 0.3s) ease;
  position: relative;
  overflow: hidden; /* Prevent any overflow from child elements */
}

/* Logo */
.registration-logo {
  height: 50px;
  margin-bottom: 20px;
}

/* Heading */
.registration-container h2 {
  margin-bottom: 30px;
  color: var(--text-color, #333333);
}

/* Step Indicators */
.steps {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  font-weight: bold;
  transition: background-color var(--transition-speed, 0.3s) ease;
}

.step.active {
  background-color: var(--primary-color, #4caf50);
}

/* Form Styles */
.form-step {
  display: flex;
  flex-direction: column;
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

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.next-button,
.back-button,
.register-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed, 0.3s) ease,
  transform var(--transition-speed, 0.3s) ease;
}

.next-button {
  background-color: var(--primary-color, #4caf50);
  color: var(--secondary-color, #f9f9f9);
}

.next-button:hover {
  background-color: #38c6a1;
  transform: translateY(-2px);
}

.back-button {
  background-color: #ccc;
  color: #333333;
}

.back-button:hover {
  background-color: #b3b3b3;
  transform: translateY(-2px);
}

.register-button {
  width: 100%;
  background-color: var(--primary-color, #4caf50);
  color: var(--secondary-color, #f9f9f9);
  padding: 12px;
  border-radius: 25px;
}

.register-button:hover {
  background-color: #38c6a1;
  transform: translateY(-2px);
}

.register-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

/* Error Messages */
.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Success Message */
.success-message {
  background-color: var(--secondary-color, #f9f9f9);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.success-message h2 {
  margin-bottom: 20px;
  color: var(--text-color, #333333);
}

.success-message p {
  font-size: 1rem;
  color: var(--text-color, #333333);
  margin: 20px 0;
}

/* Login Link */
.login-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--accent-color, #ff9800);
  color: var(--secondary-color, #f9f9f9);
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color var(--transition-speed, 0.3s) ease;
}

.login-link:hover {
  background-color: #e68900;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .registration-container,
  .success-message {
    padding: 30px 20px;
  }

  .registration-logo {
    height: 40px;
    margin-bottom: 15px;
  }

  .registration-container h2,
  .success-message h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .form-group input {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .next-button,
  .back-button,
  .register-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .login-link {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .steps {
    margin-bottom: 20px;
  }

  .step {
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
  }
}
</style>