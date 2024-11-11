// src/stores/popup.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
    const isVisible = ref(false);
    const message = ref('');
    const type = ref(''); // e.g., 'success', 'error'

    function show(msg, msgType) {
        message.value = msg;
        type.value = msgType;
        isVisible.value = true;

        // Optionally hide the popup after a delay
        setTimeout(() => {
            hide();
        }, 5000); // Hide after 5 seconds
    }

    function hide() {
        isVisible.value = false;
    }

    return {
        isVisible,
        message,
        type,
        show,
        hide,
    };
});