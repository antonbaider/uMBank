<!-- src/views/Profile.vue -->
<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-header">
        <h2 class="username">{{ profile.username }}</h2>
      </div>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div
            class="form-group"
            v-for="(fieldInfo, field) in profileFields"
            :key="field"
        >
          <label :for="field" class="field-label">
            <span>{{ fieldInfo.label }}</span>
          </label>
          <div class="input-group">
            <input
                v-if="editingField !== field"
                :type="inputType(field)"
                :id="field"
                :value="profile[field]"
                :readonly="true"
                class="read-only-input"
            />
            <input
                v-else
                :type="inputType(field)"
                :id="field"
                v-model="profile[field]"
                :placeholder="fieldInfo.label"
                :class="{ 'input-error': errors[field] }"
            />
            <div class="action-icons">
              <button
                  v-if="editingField !== field"
                  type="button"
                  class="icon-button"
                  @click="toggleEdit(field)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                  v-else
                  type="button"
                  class="icon-button"
                  @click="saveField(field)"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                  v-if="editingField === field"
                  type="button"
                  class="icon-button"
                  @click="cancelEdit"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div v-if="errors[field]" class="error-message">
            {{ errors[field] }}
          </div>
        </div>
        <div class="form-actions">
          <button
              type="submit"
              class="primary-button"
              :disabled="!isDirty || loading"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
          <button
              type="button"
              class="secondary-button"
              v-if="isDirty && !loading"
              @click="discardChanges"
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
    <!-- Popup Component -->
    <Popup
        v-if="showPopup"
        :message="popupMessage"
        :type="popupType"
        @close="showPopup = false"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '@/services/api';
import Popup from '@/components/Popup.vue';

export default {
  name: 'Profile',
  components: { Popup },
  setup() {
    const profile = ref({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    });

    const originalProfile = ref({});
    const editingField = ref(null);
    const loading = ref(false);
    const errors = reactive({});
    const showPopup = ref(false);
    const popupMessage = ref('');
    const popupType = ref('');

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/profile');
        Object.assign(profile.value, response.data.data);
        profile.value.password = '';
        originalProfile.value = { ...profile.value };
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    onMounted(fetchProfile);

    const profileFields = {
      firstName: { label: 'First Name' },
      lastName: { label: 'Last Name' },
      email: { label: 'Email' },
      phone: { label: 'Phone' },
      password: { label: 'Password' },
    };

    const inputType = (field) => {
      if (field === 'email') return 'email';
      if (field === 'password') return 'password';
      return 'text';
    };

    const toggleEdit = (field) => {
      editingField.value = field;
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
      showPopup.value = false;
    };

    const saveField = async (field) => {
      loading.value = true;
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
      showPopup.value = false;

      const updatedData = {
        firstName: profile.value.firstName,
        lastName: profile.value.lastName,
        email: profile.value.email,
        phone: profile.value.phone,
      };

      if (field === 'password' && profile.value.password) {
        updatedData.password = profile.value.password;
      }

      try {
        const response = await api.put('/api/users/update', updatedData);
        popupMessage.value = response.data.message || 'Profile updated successfully.';
        popupType.value = 'success';
        showPopup.value = true;
        originalProfile.value = { ...profile.value };
        editingField.value = null;
        profile.value.password = '';
      } catch (error) {
        if (error.response && error.response.data) {
          const data = error.response.data;
          popupMessage.value = data.message || 'Failed to update profile.';
          popupType.value = 'error';
          showPopup.value = true;

          Object.keys(errors).forEach((key) => {
            errors[key] = '';
          });

          if (data.details) {
            if (data.details.cause) {
              errors.password = data.details.cause;
            } else if (typeof data.details === 'object') {
              for (const [field, message] of Object.entries(data.details)) {
                errors[field] = message;
              }
            }
          }
        } else {
          popupMessage.value = 'Failed to update profile. Please try again later.';
          popupType.value = 'error';
          showPopup.value = true;
        }
      } finally {
        loading.value = false;
      }
    };

    const cancelEdit = () => {
      profile.value = { ...originalProfile.value };
      editingField.value = null;
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
      showPopup.value = false;
    };

    const isDirty = computed(() => {
      return JSON.stringify(profile.value) !== JSON.stringify(originalProfile.value);
    });

    const updateProfile = async () => {
      loading.value = true;
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
      showPopup.value = false;

      const updatedData = {
        firstName: profile.value.firstName,
        lastName: profile.value.lastName,
        email: profile.value.email,
        phone: profile.value.phone,
      };

      if (profile.value.password) {
        updatedData.password = profile.value.password;
      }

      try {
        const response = await api.put('/api/users/update', updatedData);
        popupMessage.value = response.data.message || 'Profile updated successfully.';
        popupType.value = 'success';
        showPopup.value = true;
        originalProfile.value = { ...profile.value };
        editingField.value = null;
        profile.value.password = '';
      } catch (error) {
        if (error.response && error.response.data) {
          const data = error.response.data;
          popupMessage.value = data.message || 'Failed to update profile.';
          popupType.value = 'error';
          showPopup.value = true;

          Object.keys(errors).forEach((key) => {
            errors[key] = '';
          });

          if (data.details) {
            if (data.details.cause) {
              errors.password = data.details.cause;
            } else if (typeof data.details === 'object') {
              for (const [field, message] of Object.entries(data.details)) {
                errors[field] = message;
              }
            }
          }
        } else {
          popupMessage.value = 'Failed to update profile. Please try again later.';
          popupType.value = 'error';
          showPopup.value = true;
        }
      } finally {
        loading.value = false;
      }
    };

    const discardChanges = () => {
      profile.value = { ...originalProfile.value };
      editingField.value = null;
      Object.keys(errors).forEach((key) => {
        errors[key] = '';
      });
      showPopup.value = false;
    };

    return {
      profile,
      profileFields,
      editingField,
      toggleEdit,
      inputType,
      saveField,
      cancelEdit,
      updateProfile,
      isDirty,
      discardChanges,
      loading,
      showPopup,
      popupMessage,
      popupType,
      errors,
    };
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.profile-card {
  width: 100%;
  max-width: 480px;
  padding: 30px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.username {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.profile-form .form-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px 40px 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
}

.read-only-input {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.input-error {
  border-color: #e3342f;
}

.error-message {
  color: #e3342f;
  font-size: 0.85rem;
  margin-top: 5px;
}

.action-icons {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
}

.icon-button:hover {
  color: #007bff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
}

.primary-button,
.secondary-button {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.primary-button:hover {
  background-color: #0056b3;
}

.primary-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.secondary-button {
  background-color: transparent;
  color: #555;
  border: 1px solid #ccc;
}

.secondary-button:hover {
  background-color: #f1f1f1;
}

@media (max-width: 576px) {
  .profile-card {
    padding: 20px;
  }

  .username {
    font-size: 1.5rem;
  }

  .input-group input {
    padding: 10px 40px 10px 12px;
  }

  .icon-button {
    font-size: 1rem;
  }

  .primary-button,
  .secondary-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>