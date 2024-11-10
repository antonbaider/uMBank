<template>
  <canvas ref="chart"></canvas>
</template>

<script>
import { Chart } from 'chart.js';
import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    expenses: Object,
    deposits: Object,
  },
  setup(props) {
    const chart = ref(null);
    const chartInstance = ref(null);

    const createChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      chartInstance.value = new Chart(chart.value, {
        type: 'line',
        data: {
          labels: Object.keys(props.expenses), // Currencies
          datasets: [
            {
              label: 'Monthly Expenses',
              data: Object.values(props.expenses),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
            },
            {
              label: 'Recent Deposits',
              data: Object.values(props.deposits),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    onMounted(createChart);
    watch(props, createChart, { deep: true });

    return { chart };
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>