<!-- src/components/ToastNotification.vue -->
<template>
  <div v-if="visible" class="toast-notification" :class="type">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, required: true },
    type: { type: String, default: 'success' }, // 'success' or 'error'
    duration: { type: Number, default: 3000 } // default to 3 seconds
  },
  data() {
    return {
      visible: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }
};
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  animation: slide-in 0.3s ease, fade-out 0.3s ease 2.7s;
}

.toast-notification.success {
  background-color: #4caf50;
}

.toast-notification.error {
  background-color: #e74c3c;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>