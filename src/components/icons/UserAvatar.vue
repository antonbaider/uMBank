<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      role="img"
      :aria-label="ariaLabel"
      class="avatar-icon"
  >
    <defs>
      <!-- Gradient Definitions -->
      <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4CAF50" />
        <stop offset="100%" stop-color="#81C784" />
      </linearGradient>
      <!-- Drop Shadow -->
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            flood-color="#000"
            flood-opacity="0.2"
        />
      </filter>
    </defs>

    <!-- Avatar Body -->
    <g filter="url(#shadow)">
      <circle cx="12" cy="7" r="5" fill="url(#userGradient)" />
      <path
          d="M12 14c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z"
          fill="url(#userGradient)"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    size: {
      type: [Number, String],
      default: 48, // Default size is 48px
    },
    ariaLabel: {
      type: String,
      default: 'User Avatar',
    },
  },
};
</script>

<style scoped>
.avatar-icon {
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}

.avatar-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

/* Responsive Scaling */
@media (max-width: 576px) {
  .avatar-icon {
    width: 36px;
    height: 36px;
  }
}
</style>