<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <section class="hero">
      <!-- SVG Background -->
      <svg
          class="hero-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--primary-color);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--accent-color);stop-opacity:1" />
          </linearGradient>
          <filter id="f1" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
        <path
            d="M0,300 C150,100 350,500 800,300 L800,600 L0,600 Z"
            fill="url(#grad1)"
            filter="url(#f1)"
        >
          <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
              M0,300 C150,100 350,500 800,300 L800,600 L0,600 Z;
              M0,300 C150,500 350,100 800,300 L800,600 L0,600 Z;
              M0,300 C150,100 350,500 800,300 L800,600 L0,600 Z
            "
          />
        </path>
      </svg>

      <!-- Hero Content -->
      <div class="hero-content">
        <h1 class="hero-title">Empower Your Financial Journey</h1>
        <p class="hero-subtitle">
          Experience seamless banking with our innovative and secure solutions tailored for you.
        </p>
        <router-link to="/login" class="cta-button">
          Get Started
        </router-link>
      </div>

      <!-- Optional Decorative SVG Illustration -->
      <div class="hero-illustration">
        <!-- Example SVG Illustration -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 300"
            class="illustration-svg"
        >
          <circle cx="150" cy="150" r="100" fill="none" stroke="#FFFFFF" stroke-width="5" />
          <path
              d="M150 50 L170 150 L130 150 Z"
              fill="#FFFFFF"
              opacity="0.8"
          >
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 150 150"
                to="360 150 150"
                dur="20s"
                repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </section>

    <!-- Features Section (Unchanged) -->
    <section class="features">
      <div class="feature-card">
        <i class="fas fa-university fa-3x feature-icon"></i>
        <h3>Secure Transactions</h3>
        <p>
          Your security is our priority. Experience safe and reliable transactions every time.
        </p>
      </div>
      <div class="feature-card">
        <i class="fas fa-chart-line fa-3x feature-icon"></i>
        <h3>Real-Time Analytics</h3>
        <p>
          Gain insights into your spending habits with our comprehensive analytics tools.
        </p>
      </div>
      <div class="feature-card">
        <i class="fas fa-mobile-alt fa-3x feature-icon"></i>
        <h3>Mobile Access</h3>
        <p>
          Manage your accounts on the go with our intuitive mobile application.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Enhanced Hero Section */
.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* SVG Background Styling */
.hero-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Hero Content Styling */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #ffffff;
  max-width: 700px;
  padding: 0 20px;
  animation: fadeIn 2s ease-out;
}

.hero-title {
  color: #ffffff; /* Fallback color */
  background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 40px;
}

.cta-button {
  padding: 15px 30px;
  background-color: #38bdf8; /* Bright accent color */
  color: #f0f4ff; /* Dark text color for contrast */
  border: none;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  background-color: #0ea5e9; /* Slightly darker on hover */
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.cta-button:focus {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

/* Optional Decorative SVG Illustration */
.hero-illustration {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

.illustration-svg {
  width: 100%;
  height: 100%;
}

/* Keyframe Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -20px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

/* Enhanced Features Section */
.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 60px 20px;
  width: 100%;
  max-width: 1200px;
}

.feature-card {
  background-color: #ffffff;
  color: #1e3a8a;
  border-radius: 15px;
  padding: 30px 20px;
  margin: 15px;
  width: 280px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  color: #38bdf8; /* Match CTA button accent color */
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
}

.feature-card p {
  font-size: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .cta-button {
    padding: 12px 25px;
    font-size: 0.95rem;
  }

  .hero-illustration {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 60vh;
    flex-direction: column;
    justify-content: center;
  }

  .hero-illustration {
    display: none; /* Hide illustration on smaller screens */
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .cta-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>