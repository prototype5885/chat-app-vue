<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  user: string;
}>();
</script>

<template>
  <div class="mx-8 my-1 h-4 flex items-center">
    <div v-if="props.user" class="flex flex-row">
      <div id="svg-container" class="flex items-center">
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
      </div>
      <label class="ml-2 text-white">{{ props.user }} is typing...</label>
    </div>
  </div>
</template>

<style scoped lang="css">
#svg-container svg:nth-child(1) {
  animation-delay: 0s;
}

#svg-container svg:nth-child(2) {
  animation-delay: 0.25s;
}

#svg-container svg:nth-child(3) {
  animation-delay: 0.5s;
}

#svg-container svg {
  margin-left: 2px;
  margin-right: 2px;
  animation: size-change 1.5s infinite;
}

@keyframes color-change {
  0%,
  100% {
    stroke: red;
  }

  33% {
    stroke: white;
  }

  66% {
    stroke: white;
  }
}

@keyframes size-change {
  0%,
  100% {
    transform: scale(1);
    fill-opacity: 0.5;
  }

  33% {
    transform: scale(1.5);
    fill-opacity: 1;
  }

  66% {
    transform: scale(1);
    fill-opacity: 0.5;
  }
}

.svg-container:nth-child(1) {
  animation-delay: 0s;
}

.svg-container:nth-child(2) {
  animation-delay: 1s;
}

.svg-container:nth-child(3) {
  animation-delay: 2s;
}
</style>
