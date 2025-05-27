<script setup lang="ts">
const props = defineProps<{
  size: number;
  pic: string;
  name: string;
  pressed: () => Promise<void>;
}>();
</script>

<template>
  <button
    :class="`min-w-${size} max-w-${size} min-h-${size} max-h-${size} bg-cover bg-center rounded-full bg-black/15 hover:bg-blue-500 transition-all`"
    :style="`background-image: url(/avatars/${pic})`"
    @click="pressed"
  >
    <span v-if="!pic">{{ props.name[0].toUpperCase() }}</span>
  </button>
</template>
