<template>
  <div class="dashboard">
    <section class="overview">
      <div class="overview-card">
        <i class="fas fa-wallet fa-2x feature-icon"></i>
        <h3>Total Balance</h3>
        <div class="balance-list">
          <div v-for="(amount, currency) in totalBalanceByCurrency" :key="currency">
            <p>{{ formatCurrency(amount, currency) }}</p>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <i class="fas fa-chart-line fa-2x feature-icon"></i>
        <h3>Monthly Expenses</h3>
        <div class="balance-list">
          <div v-for="(amount, currency) in monthlyExpensesByCurrency" :key="currency">
            <p>{{ formatCurrency(Math.abs(amount), currency) }}</p>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <i class="fas fa-arrow-up fa-2x feature-icon"></i>
        <h3>Recent Deposits</h3>
        <div class="balance-list">
          <div v-for="(amount, currency) in recentDepositsByCurrency" :key="currency">
            <p>{{ formatCurrency(amount, currency) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section
        class="chart-section"
        :style="{
        padding: '20px',
    maxWidth: '600px',
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  }"
    ><canvas id="expensesChart"></canvas>
      <LineChart :expenses="monthlyExpensesByCurrency" :deposits="recentDepositsByCurrency"/>
      <canvas id="depositsChart"></canvas>
    </section>

    <section class="transactions">
      <table>
        <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Transaction ID</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in transactions" :key="transaction.transactionId">
          <td data-label="Date">{{ formatDate(transaction.timestamp) }}</td>
          <td data-label="Description">{{ formatDescription(transaction) }}</td>
          <td :class="{ 'negative': isOutgoingTransaction(transaction) }" data-label="Amount">
            {{ formatCurrency(displayAmount(transaction), transaction.currency) }}
          </td>
          <td data-label="Transaction ID">{{ transaction.transactionId }}</td>
        </tr>
        </tbody>
      </table>
      <div v-if="transactions.length === 0" class="no-transactions">
        No recent transactions found.
      </div>
    </section>


  </div>
</template>

<script>
import {computed, onMounted, ref} from 'vue';
import api from '@/services/api.js';
import Chart from 'chart.js/auto';
import LineChart from "@/components/LineChart.vue";
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Dashboard',
  components: {LineChart},
  setup() {
    const transactions = ref([]);
    const accounts = ref([]);
    const loading = ref(true);
    const authStore = useAuthStore();
    const userName = computed(() => authStore.user?.username || 'User');



    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/transactions/history');
        transactions.value = response.data.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await api.get('/api/accounts');
        accounts.value = response.data.data;
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    const totalBalanceByCurrency = computed(() => {
      return accounts.value.reduce((acc, account) => {
        acc[account.currency] = (acc[account.currency] || 0) + account.balance;
        return acc;
      }, {});
    });

    const isOutgoingTransaction = (transaction) => {
      return accounts.value.some(account => account.cardNumber === transaction.senderCardNumber);
    };

    const isIncomingTransaction = (transaction) => {
      return accounts.value.some(account => account.cardNumber === transaction.receiverAccountId);
    };

    const displayAmount = (transaction) => {
      return isOutgoingTransaction(transaction) ? -Math.abs(transaction.amount) : transaction.amount;
    };

    // Update description to display "Me" for own card numbers, otherwise show the card number
    const formatDescription = (transaction) => {
      const sender = isOutgoingTransaction(transaction) ? 'Me' : transaction.senderCardNumber || 'N/A';
      const receiver = isIncomingTransaction(transaction) ? 'Me' : transaction.receiverAccountId || 'N/A';
      return `From ${sender} to ${receiver}`;
    };

    // Format the timestamp to include date and time (hours, minutes, seconds)
    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    const monthlyExpensesByCurrency = computed(() => {
      const currentMonth = new Date().getMonth();
      const expenses = {};

      accounts.value.forEach(account => {
        expenses[account.currency] = 0;
      });

      transactions.value.forEach((tx) => {
        if (isOutgoingTransaction(tx) && new Date(tx.timestamp).getMonth() === currentMonth) {
          const currency = tx.currency;
          expenses[currency] = (expenses[currency] || 0) + tx.amount;
        }
      });

      return expenses;
    });

    const recentDepositsByCurrency = computed(() => {
      const currentMonth = new Date().getMonth();
      const deposits = {};

      accounts.value.forEach(account => {
        deposits[account.currency] = 0;
      });

      transactions.value.forEach((tx) => {
        if (isIncomingTransaction(tx) && new Date(tx.timestamp).getMonth() === currentMonth) {
          const currency = tx.currency;
          deposits[currency] = (deposits[currency] || 0) + tx.amount;
        }
      });

      return deposits;
    });

    const formatCurrency = (amount, currency) => {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
      }).format(amount);
    };

    const renderCharts = () => {
      const expensesChart = new Chart(document.getElementById('expensesChart'), {
        type: 'bar',
        data: {
          labels: Object.keys(monthlyExpensesByCurrency.value),
          datasets: [{
            label: 'Monthly Expenses',
            data: Object.values(monthlyExpensesByCurrency.value),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
      });
      const depositsChart = new Chart(document.getElementById('depositsChart'), {
        type: 'bar',
        data: {
          labels: Object.keys(recentDepositsByCurrency.value),
          datasets: [{
            label: 'Recent Deposits',
            data: Object.values(recentDepositsByCurrency.value),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
      });
    };

    onMounted(async () => {
      await fetchAccounts();
      await fetchTransactions();
      loading.value = false;
      renderCharts();
    });

    return {
      userName,
      transactions,
      loading,
      totalBalanceByCurrency,
      monthlyExpensesByCurrency,
      recentDepositsByCurrency,
      formatDate,
      formatDescription,
      formatCurrency,
      isOutgoingTransaction,
      displayAmount,
    };
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.overview {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.overview-card {
  background-color: var(--secondary-color);
  color: #000000;
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  margin-bottom: 20px;
}

.balance-list p {
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  color: var(--text-color-primary);
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--secondary-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


thead {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

th, td {
  padding: 15px;
  text-align: left;
}

.negative {
  color: #e74c3c; /* Red for negative amounts */
}

.no-transactions {
  text-align: center;
  padding: 20px;
  color: var(--text-color-primary);
}
.feature-icon {
  color: #4a8bd9;
  margin-bottom: 15px;
}
</style>