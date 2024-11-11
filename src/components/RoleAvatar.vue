<!-- src/components/RoleAvatar.vue -->
<template>
  <div class="role-avatar">
    <UserAvatar v-if="role === 'ROLE_USER'" />
    <AdminAvatar v-else-if="role === 'ROLE_ADMIN'" />
      <!-- Optional: For guests or undefined roles -->
  </div>
</template>

<script>
import UserAvatar from './icons/UserAvatar.vue';
import AdminAvatar from './icons/AdminAvatar.vue';
// Optional: Define a GuestAvatar if you want to handle guests
// import GuestAvatar from './icons/GuestAvatar.vue';

export default {
  name: 'RoleAvatar',
  components: {
    UserAvatar,
    AdminAvatar,
    // GuestAvatar,
  },
  props: {
    role: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.role-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>