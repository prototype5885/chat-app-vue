<script setup lang="ts">
import { Settings } from "lucide-vue-next";
</script>

<template>
  <div class="flex items-center h-full px-2 min-h-14 max-h-14 bg-black/35">
    <button class="w-3/5 flex items-center hover-bg hover:rounded-lg p-1">
      <!-- avatar -->
      <div class="flex flex-col items-start ml-2">
        <span class="text-sm">Name</span>
        <span class="text-xs">Status</span>
      </div>
    </button>

    <div class="w-2/5 flex justify-evenly">
      <button class="hover-bg hover:rounded-lg" v-tooltip.top="'User Settings'">
        <Settings stroke-width="1" class="m-1" />
      </button>
    </div>
  </div>
</template>
