<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// these are so messages will re render when channel changes
const channelKey = ref<string>(route.params.channel as string);
watch(
  () => route.params.channel,
  () => {
    channelKey.value = route.params.channel as string;
  }
);
</script>

<template>
  <div class="flex flex-row h-screen grow">
    <div class="flex flex-col min-w-60 max-w-60">
      <ChannelList class="bg-black/20" />
      <UserPanel />
    </div>
    <RouterView :key="channelKey" />
  </div>
</template>
