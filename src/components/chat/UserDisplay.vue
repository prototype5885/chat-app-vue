<script setup lang="ts">
import Avatar from "@/components/Avatar.vue";

const props = defineProps<{
  displayName: string;
  picture: string;
  size: string;
}>();
</script>

<template>
  <button class="w-3/5 flex grow items-center hover-bg hover:rounded-lg p-1">
    <Avatar :size="size" :pic="props.picture" :name="props.displayName" />
    <div class="flex flex-col items-start ml-2">
      <span class="text-sm">{{ props.displayName }}</span>
      <span class="text-xs">Status</span>
    </div>
  </button>
</template>
