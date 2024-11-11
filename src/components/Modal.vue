<!-- src/components/Modal.vue -->
<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div
        class="absolute inset-0 bg-black opacity-50"
        @click="$emit('close')"
    ></div>
    <div class="bg-white rounded-lg shadow-lg z-10 w-11/12 max-w-md">
      <div class="px-6 py-4 border-b">
        <slot name="header"></slot>
      </div>
      <div class="px-6 py-4">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
};
</script>
