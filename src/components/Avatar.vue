<script setup lang="ts">
const props = defineProps<{
  size: string;
  pic: string;
  name: string;
  pressed?: () => Promise<void>;
}>();
</script>

<template>
  <button
    class="bg-cover bg-center rounded-full bg-black/15 hover:bg-blue-500 transition-all"
    :style="`background-image: url(/cdn/avatars/${pic}); min-width: ${size}px; max-width: ${size}px; min-height: ${size}px; max-height: ${size}px`"
    @click="pressed"
  >
    <span v-if="!pic">{{ props.name ? props.name[0].toUpperCase() : "" }}</span>
  </button>
</template>
