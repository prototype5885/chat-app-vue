<script setup lang="ts">
const props = defineProps<{
  placeholder?: string | undefined;
  autocomplete?: string | undefined;
  type: string;
  error?: string;
}>();

const model = defineModel();
</script>

<template>
  <div>
    <input
      v-model="model"
      :placeholder="props.placeholder"
      :autocomplete="autocomplete"
      :type="type"
      class="border-1 rounded p-2"
      :class="error ? 'border-1 border-red-500' : ' '"
    />
    <h1 class="text-red-500">{{ props.error }}</h1>
  </div>
</template>
