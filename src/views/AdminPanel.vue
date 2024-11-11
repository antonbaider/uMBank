<template>
  <div class="admin-panel">
    <h2>Admin Panel - Make Payment</h2>
    <form @submit.prevent="handlePayment">
      <div class="form-group">
        <label for="senderAccountId">Sender Account ID</label>
        <input type="number" id="senderAccountId" v-model="senderAccountId" required />
      </div>
      <div class="form-group">
        <label for="receiverAccountId">Receiver Account ID</label>
        <input type="number" id="receiverAccountId" v-model="receiverAccountId" required />
      </div>
      <div class="form-group">
        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model="amount" min="1" required />
      </div>
      <button type="submit" class="submit-button">Transfer</button>
    </form>

    <Popup v-if="notification.message" :message="notification.message" :type="notification.type" />
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '@/services/api';
import Popup from '@/components/Popup.vue';

export default {
  name: 'AdminPanel',
  components: { Popup },
  setup() {
    const senderAccountId = ref('');
    const receiverAccountId = ref('');
    const amount = ref('');
    const notification = ref({ message: '', type: '' });

    const handlePayment = async () => {
      try {
        const response = await api.post('/api/transactions/transfer', {
          senderAccountId: senderAccountId.value,
          receiverAccountId: receiverAccountId.value,
          amount: amount.value,
        });
        notification.value = { message: 'Transfer successful!', type: 'success' };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Transfer failed.';
        notification.value = { message: errorMessage, type: 'error' };
      }
    };

    return {
      senderAccountId,
      receiverAccountId,
      amount,
      handlePayment,
      notification,
    };
  },
};
</script>

<style scoped>
.admin-panel {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #357abd;
}
</style>