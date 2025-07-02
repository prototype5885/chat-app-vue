<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean | undefined;
    label?: string;
    type?: "button" | "submit" | "reset" | undefined;
  }>(),
  {
    disabled: false,
    label: "",
  }
);

const emit = defineEmits(["click"]);
</script>

<template>
  <button
    @click="emit('click')"
    :type="type"
    :disabled="props.disabled"
    class="bg-black/50 hover:bg-black/65 rounded-md text-white p-2 transition-colors duration-200"
  >
    {{ props.label }}
  </button>
</template>
