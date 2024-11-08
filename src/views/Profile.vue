<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2 class="profile-title">Your Profile</h2>
      <table class="profile-table">
        <tbody>
        <tr v-for="(value, label) in profileDetails" :key="label">
          <td class="profile-icon">
            <i :class="iconClass(label)"></i>
          </td>
          <td class="profile-label">{{ label }}</td>
          <td class="profile-value">{{ value }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue';
import api from '@/services/api';

export default {
  name: 'Profile',
  setup() {
    const profile = ref({});

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/profile');
        profile.value = response.data.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    onMounted(fetchProfile);

    const profileDetails = computed(() => ({
      "First Name": profile.value.firstName,
      "Last Name": profile.value.lastName,
      "Username": profile.value.username,
      "Email": profile.value.email,
      "Phone": profile.value.phone,
      "SSN": profile.value.ssn,
    }));

    const iconClass = (label) => {
      const icons = {
        "First Name": "fas fa-user",
        "Last Name": "fas fa-user",
        "Username": "fas fa-user-tag",
        "Email": "fas fa-envelope",
        "Phone": "fas fa-phone",
        "SSN": "fas fa-id-card",
      };
      return icons[label] || "fas fa-info-circle";
    };

    return {
      profileDetails,
      iconClass,
    };
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.profile-card {
  background-color: #ffffff;
  padding: 25px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.profile-title {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

.profile-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  color: #555;
}

.profile-table td {
  padding: 12px 10px;
  vertical-align: middle;
}

.profile-icon {
  width: 40px;
  text-align: center;
  color: #4A90E2;
}

.profile-label {
  font-weight: 600;
  color: #333;
}

.profile-value {
  color: #666;
  text-align: left;
  font-weight: 400;
}

.profile-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.profile-table tr:hover {
  background-color: #f0f4f8;
}
</style>