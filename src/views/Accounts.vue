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
              <!-- Toggle between masked and full card number on click -->
              <h3 @click="toggleCardVisibility(index)">
                {{ visibleCards[index] ? account.cardNumber : maskCardNumber(account.cardNumber) }}
              </h3>
              <p>{{ account.currency }}</p>
            </div>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';

export default {
  name: 'Accounts',
  setup() {
    const accounts = ref([]);
    const loading = ref(true);
    const visibleCards = ref([]); // Array to track visibility for each card number

    // Fetch accounts data from API
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/api/accounts');
        if (response.data && response.data.data) {
          accounts.value = response.data.data;
          visibleCards.value = Array(accounts.value.length).fill(false); // Initialize visibility to false for each card
        } else {
          console.error('No account data found.');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        loading.value = false;
      }
    };

    // Toggle card visibility for a specific card index
    const toggleCardVisibility = (index) => {
      visibleCards.value[index] = !visibleCards.value[index];
    };

    // Mask the card number to show only the last 4 digits
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
  cursor: pointer; /* Indicate that the card number is clickable */
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

.no-accounts {
  text-align: center;
  color: var(--text-color);
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .accounts-list {
    align-items: center;
  }

  .account-card {
    width: 90%;
    max-width: 400px;
  }
}
</style>