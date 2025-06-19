<script setup lang="ts">
const props = defineProps({
  channel: String,
});
</script>

<template>
  <div class="flex flex-row grow h-screen">
    <div class="flex flex-col grow">
      <Top>{{ channel }}</Top>
      <MessageArea />
    </div>

    <div class="min-w-64 w-64 flex flex-col">
      <Top>above members</Top>
      <div class="bg-black/20 flex-1"></div>
    </div>
  </div>
</template>
