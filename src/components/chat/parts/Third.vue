<script setup lang="ts">
import { useRoute } from "vue-router";
</script>

<template>
  <div class="flex flex-row grow h-screen">
    <div class="flex flex-col grow">
      <Top>{{ useRoute().params.channel as string }}</Top>
      <MessageArea />
    </div>

    <div class="min-w-64 w-64 flex flex-col">
      <Top>above members</Top>
      <div class="bg-black/20 flex-1"></div>
    </div>
  </div>
</template>
