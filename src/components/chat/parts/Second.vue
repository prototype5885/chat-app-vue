<script setup lang="ts">
const props = defineProps({
  server: String,
});
</script>

<template>
  <div class="flex flex-row h-screen grow">
    <div class="flex flex-col min-w-60 max-w-60">
      <ChannelList class="bg-black/20" />
      <UserPanel />
    </div>
    <RouterView :key="props.server" />
  </div>
</template>
