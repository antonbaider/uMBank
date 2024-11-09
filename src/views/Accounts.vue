<template>
  <div class="accounts-page">
    <section class="accounts-list">
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <p>Loading your accounts...</p>
      </div>
      <div v-else>
        <div v-if="accounts.length" class="account-card" v-for="(account, index) in accounts" :key="index">
          <div class="account-header">
            <i class="fas fa-credit-card fa-2x account-icon"></i>
            <div class="account-info">
              <h3 @click="toggleCardVisibility(index)">
                {{ visibleCards[index] ? account.cardNumber : maskCardNumber(account.cardNumber) }}
              </h3>
              <p>{{ account.currency }}</p>
            </div>
            <button v-if="account.balance === 0" class="close-button" @click="attemptCloseAccount(account)">
              &times;
            </button>
          </div>
          <div class="account-details">
            <p><strong>Balance:</strong> {{ formatCurrency(account.balance, account.currency) }}</p>
            <p><strong>Expiration Date:</strong> {{ formatDate(account.expirationDate) }}</p>
          </div>
        </div>
        <div v-else class="no-accounts">
          <p>You have no accounts to display.</p>
        </div>
      </div>
    </section>

    <!-- Stylish Open Account Section -->
    <section class="add-account">
      <div class="wave-background">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
      </div>
      <h3>Open a New Account</h3>
      <div class="account-form">
        <select v-model="selectedCurrency" class="currency-select">
          <option disabled value="">Select a Currency</option>
          <option v-for="currency in availableCurrencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
        <button @click="openAccount" :disabled="!selectedCurrency" class="open-account-button">
          Open Account
        </button>
      </div>
    </section>

    <ConfirmModal
        v-if="modalVisible"
        :visible="modalVisible"
        @confirm="confirmCloseAccount"
        @cancel="hideConfirmModal"
    />

    <ToastNotification
        v-if="toastMessage"
        :message="toastMessage"
        :type="toastType"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import ToastNotification from '@/components/ToastNotification.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

export default {
  name: 'Accounts',
  components: { ToastNotification, ConfirmModal },
  setup() {
    const accounts = ref([]);
    const loading = ref(true);
    const visibleCards = ref([]);
    const toastMessage = ref('');
    const toastType = ref('success');
    const modalVisible = ref(false);
    const accountToClose = ref(null);
    const selectedCurrency = ref('');
    const availableCurrencies = ref(['USD', 'EUR', 'PLN', 'GBP', 'INR']);

    const fetchAccounts = async () => {
      try {
        const response = await api.get('/api/accounts');
        if (response.data && response.data.data) {
          accounts.value = response.data.data;
          visibleCards.value = Array(accounts.value.length).fill(false);
          updateAvailableCurrencies();
        } else {
          console.error('No account data found.');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        loading.value = false;
      }
    };

    const updateAvailableCurrencies = () => {
      const openedCurrencies = accounts.value.map(account => account.currency);
      availableCurrencies.value = availableCurrencies.value.filter(currency => !openedCurrencies.includes(currency));
    };

    const toggleCardVisibility = (index) => {
      visibleCards.value[index] = !visibleCards.value[index];
    };

    const maskCardNumber = (cardNumber) => {
      return '**** **** **** ' + cardNumber.slice(-4);
    };

    const formatCurrency = (amount, currency) => {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
      }).format(amount);
    };

    const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    const attemptCloseAccount = (account) => {
      if (account.balance > 0) {
        showNotification('Account balance must be zero before closing.', 'error');
        return;
      }
      accountToClose.value = account;
      modalVisible.value = true;
    };

    const hideConfirmModal = () => {
      modalVisible.value = false;
      accountToClose.value = null;
    };

    const confirmCloseAccount = async () => {
      try {
        if (!accountToClose.value || !accountToClose.value.cardNumber) {
          showNotification('Account information is missing. Please try again.', 'error');
          return;
        }

        const response = await api.delete('/api/accounts/close', {
          data: { cardNumber: accountToClose.value.cardNumber },
        });

        if (response.data && response.data.message) {
          showNotification(response.data.message, 'success');
          await fetchAccounts();
        }
        hideConfirmModal();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to close account.';
        showNotification(errorMessage, 'error');
        console.error('Account Closure Error:', error);
      }
    };

    const showNotification = (message, type = 'success') => {
      toastMessage.value = message;
      toastType.value = type;
      setTimeout(() => {
        toastMessage.value = '';
      }, 3000);
    };

    const openAccount = async () => {
      if (!selectedCurrency.value) {
        showNotification('Please select a currency.', 'error');
        return;
      }

      try {
        const response = await api.post('/api/accounts', {
          currency: selectedCurrency.value,
        });

        if (response.data && response.data.data) {
          accounts.value.push(response.data.data);
          updateAvailableCurrencies();
          selectedCurrency.value = '';
          showNotification('Account created successfully!', 'success');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to create account.';
        showNotification(errorMessage, 'error');
        console.error('Account Creation Error:', error);
      }
    };

    onMounted(() => {
      fetchAccounts();
    });

    return {
      accounts,
      loading,
      visibleCards,
      toggleCardVisibility,
      maskCardNumber,
      formatCurrency,
      formatDate,
      attemptCloseAccount,
      hideConfirmModal,
      confirmCloseAccount,
      modalVisible,
      toastMessage,
      toastType,
      selectedCurrency,
      availableCurrencies,
      openAccount,
    };
  },
};
</script>

<style scoped>
.accounts-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-color);
}

.loading p {
  margin-top: 15px;
  font-size: 1.2rem;
}

.account-card {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  position: relative;
}

.account-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.account-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.account-icon {
  color: var(--primary-color);
  margin-right: 15px;
}

.account-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
  cursor: pointer;
}

.account-info p {
  margin: 5px 0 0 0;
  color: var(--text-color);
}

.account-details p {
  margin: 5px 0;
  font-size: 1rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e74c3c;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  transition: color 0.2s ease, transform 0.2s ease;
}

.close-button:hover {
  color: #ff6b6b;
  transform: scale(1.2);
}

.close-button:focus {
  outline: none;
}

.close-button:active {
  transform: scale(1.05);
}

.no-accounts {
  text-align: center;
  color: var(--text-color);
  font-size: 1.2rem;
}

.add-account {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 30px auto;
}

.add-account h3 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.account-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.currency-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
}

.open-account-button {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.open-account-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.open-account-button:hover:not(:disabled) {
  background-color: #1e90ff;
}

@media (max-width: 768px) {
  .accounts-list {
    align-items: center;
  }

  .account-card {
    width: 90%;
    max-width: 400px;
  }

  .add-account {
    width: 90%;
  }
}.accounts-page {
   padding: 20px;
   max-width: 1200px;
   margin: 0 auto;
 }

.accounts-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-account {
  position: relative;
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 550px;
  margin: 30px auto;
  color: #fff;
}

.wave-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0.5;
  border-radius: 45%;
  animation: wave-animation 6s infinite linear;
}

.wave1 {
  top: -50%;
  left: -50%;
  animation-delay: 0s;
}

.wave2 {
  top: -55%;
  left: -55%;
  animation-delay: 2s;
}

@keyframes wave-animation {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10%) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

.add-account h3 {
  z-index: 1;
  position: relative;
  font-size: 1.8rem;
  color: #aceafa;
  margin-bottom: 15px;
}

.account-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
  position: relative;
}

.currency-select {
  width: 100%;
  max-width: 300px;
  padding: 12px 15px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  color: #a7d6ec;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  outline: none;
  transition: transform 0.2s ease;
}

.currency-select:hover {
  transform: scale(1.05);
}

.open-account-button {
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 1rem;
  color: #fff;
  background: #ff7e5f;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.open-account-button:hover {
  background: #feb47b;
  transform: scale(1.1);
}

.open-account-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .accounts-list {
    align-items: center;
  }

  .add-account {
    width: 90%;
  }

  .account-card {
    width: 90%;
    max-width: 400px;
  }
}
</style>