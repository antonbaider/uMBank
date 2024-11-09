<template>
  <div class="support-page">
    <div class="support-container">
      <h2 class="support-title">We're Here to Help!</h2>
      <p class="support-subtitle">Have feedback or need assistance? Let us know below.</p>
      <form @submit.prevent="submitFeedback" class="feedback-form">
        <textarea
            v-model="feedback"
            placeholder="Type your message here..."
            required
            class="feedback-textarea"
        ></textarea>
        <button type="submit" class="feedback-button">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '@/services/api.js';

export default {
  setup() {
    const feedback = ref('');

    const submitFeedback = async () => {
      try {
        await api.post('/feedback', { feedback: feedback.value });
        alert('Thank you! Your message has been sent.');
        feedback.value = '';
      } catch (error) {
        console.error('Feedback Submission Error:', error);
        alert('Oops! Unable to send your message at this time.');
      }
    };

    return { feedback, submitFeedback };
  }
};
</script>

<style scoped>
/* Support Page with Wavy Background */
.support-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px; background-size: 300% 300%;
  animation: wavyBackground 8s ease-in-out infinite;
}

/* Support Container with Float Effect */
.support-container {
  margin-top: -100px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: floatUp 3s ease-in-out infinite;
}

/* Title Styling with Slight Flicker Effect */
.support-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 10px;
  animation: flicker 2s ease-in-out infinite alternate;
}

/* Subtitle Styling */
.support-subtitle {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

/* Form Styling */
.feedback-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Textarea Styling with Subtle Hover Glow */
.feedback-textarea {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 1rem;
  color: #333;
  border: 2px solid #90caf9;
  border-radius: 10px;
  outline: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.feedback-textarea:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: #1976d2;
}

/* Button Styling with Wave Animation */
.feedback-button {
  padding: 12px 30px;
  background-color: #1976d2;
  color: #ffffff;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  animation: wave 4s ease-in-out infinite;
}

.feedback-button:hover {
  background-color: #1565c0;
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

/* Success and Error Message Styling */
.success-message,
.error-message {
  margin-top: 20px;
  font-size: 1rem;
}

.success-message {
  color: #28a745;
}

.error-message {
  color: #e74c3c;
}

/* Keyframe Animations */
@keyframes wavyBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes floatUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(3deg);
  }
}
</style>