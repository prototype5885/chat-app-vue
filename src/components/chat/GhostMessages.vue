<script setup lang="ts">
import { rand } from "@vueuse/core";
</script>

<template>
  <ul class="max-w-full overflow-hidden">
    <li v-for="i in 10" :key="i" class="flex flex-row px-3 py-2">
      <div class="rounded-full h-10 w-10 bg-white/10"></div>
      <div class="flex flex-col pl-3 gap-2 w-full">
        <div
          class="h-4 bg-white/25 rounded-xl"
          :style="`width: ${rand(5, 20)}%;`"
        ></div>
        <div
          v-for="i in rand(1, 3)"
          :key="i"
          class="h-4 bg-white/10 rounded-xl"
          :style="`width: ${rand(5, 90)}%;`"
        ></div>
      </div>
    </li>
  </ul>
</template>
