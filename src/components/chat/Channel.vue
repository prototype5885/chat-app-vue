<script setup lang="ts">
import { Hash } from "lucide-vue-next";
import { defineProps } from "vue";

const props = defineProps<{
  id: string;
  selected: boolean;
}>();

defineEmits(["channel-selected"]);
</script>

<template>
  <li>
    <button
      class="w-full flex items-center h-9 rounded-lg hover:text-white"
      :class="selected ? ' bg-white/8 text-white' : 'hover-bg '"
      @click="$emit('channel-selected', props.id)"
    >
      <Hash class="mx-1" :stroke-width="2" :size="20" />
      <span class="ml-1">{{ props.id }}</span>
    </button>
  </li>
</template>
