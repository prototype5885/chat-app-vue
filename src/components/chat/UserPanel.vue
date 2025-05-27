<script setup lang="ts">
import { Settings } from "lucide-vue-next";
</script>

<template>
  <div class="flex items-center h-full px-2 min-h-14 max-h-14 bg-black/35">
    <button class="w-3/5 flex items-center hover-bg hover:rounded-lg p-1">
      <UAvatar />
      <div class="flex flex-col items-start ml-2">
        <span class="text-sm">Name</span>
        <span class="text-xs">Status</span>
      </div>
    </button>

    <div class="w-2/5 flex justify-evenly">
      <UPopover arrow mode="hover">
        <button class="hover-bg hover:rounded-lg">
          <Settings stroke-width="1" class="m-1" />
        </button>
        <template #content>User Settings</template>
      </UPopover>

      <!-- <UPopover
        mode="hover"
        arrow
        :ui="{
          content: 'text-black',
        }"
      >
        <button class="flex items-center justify-center size-8">
          <UIcon name="i-custom-gear" class="size-6"></UIcon>
        </button>
        <template #content> XD </template>
      </UPopover> -->
    </div>
  </div>
</template>
