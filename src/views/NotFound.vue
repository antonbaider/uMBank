<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Oops! You seem lost in the web.</p>
      <router-link to="/" class="back-link">Go Back Home</router-link>
    </div>

    <!-- Parallax Layers for Depth Effect -->
    <div class="parallax">
      <div class="parallax-layer layer1"></div>
      <div class="parallax-layer layer2"></div>
      <div class="parallax-layer layer3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
/* Basic Layout */
.not-found {
  position: relative;
  height: 100vh;
  overflow: hidden;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  position: relative;
  z-index: 10;
  text-align: center;
}

h1 {
  font-size: 10rem;
  font-weight: 800;
  color: #ff6b6b;
  margin: 0;
  animation: float-text 3s ease-in-out infinite;
}

p {
  font-size: 1.5rem;
  color: #ffffff;
  animation: float-text 3s ease-in-out infinite alternate;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ff6b6b;
  font-weight: 500;
  border-radius: 30px;
  text-decoration: none;
  animation: button-hover 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

.back-link:hover {
  background-color: rgba(255, 255, 255, 0.4);
  color: #ff4757;
}

/* Floating Animation */
@keyframes float-text {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Parallax Layers Styling */
.parallax {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
  perspective: 1px;
}

.parallax-layer {
  position: absolute;
  width: 150%;
  height: 150%;
  background-size: cover;
  background-position: center;
  animation: parallax-move 10s ease-in-out infinite alternate;
  opacity: 0.4;
}

.layer1 {
  background-image: url('https://source.unsplash.com/random/1920x1080?nature'); /* Background 1 */
  transform: translateZ(-1px) scale(1.5);
}

.layer2 {
  background-image: url('https://source.unsplash.com/random/1920x1080?mountains'); /* Background 2 */
  transform: translateZ(-0.5px) scale(1.3);
  opacity: 0.5;
}

.layer3 {
  background-image: url('https://source.unsplash.com/random/1920x1080?sky'); /* Background 3 */
  transform: translateZ(-0.2px) scale(1.2);
  opacity: 0.6;
}

/* Animation for Parallax */
@keyframes parallax-move {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>