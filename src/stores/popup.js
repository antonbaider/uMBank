// src/stores/popup.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
    const isVisible = ref(false);
    const message = ref('');
    const type = ref(''); // 'success' or 'error'

    const show = (msg, popupType = 'success') => {
        message.value = msg;
        type.value = popupType;
        isVisible.value = true;
        // Automatically hide after 3 seconds
        setTimeout(() => {
            isVisible.value = false;
        }, 3000);
    };

    const hide = () => {
        isVisible.value = false;
    };

    return {
        isVisible,
        message,
        type,
        show,
        hide,
    };
});