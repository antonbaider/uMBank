<!-- src/components/Popup.vue -->
<template>
  <div v-if="popup.isVisible" :class="['popup', popup.type]">
    <p>{{ popup.message }}</p>
    <button @click="popup.hide">X</button>
  </div>
</template>

<script>
import { usePopupStore } from '@/stores/popup.js';

export default {
  name: 'Popup',
  setup() {
    const popup = usePopupStore();
    return { popup };
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  color: #fff;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.popup.success {
  background-color: #4caf50;
}

.popup.error {
  background-color: #e74c3c;
}

.popup button {
  background: none;
  border: none;
  color: #fff;
  margin-left: 15px;
  cursor: pointer;
  font-size: 1rem;
}
</style>