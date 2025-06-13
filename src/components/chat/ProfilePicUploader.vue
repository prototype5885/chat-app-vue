<script setup lang="ts">
import { ref } from "vue";

const preview = ref<string>("");
const picture = defineModel<File | null>({ required: true });

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    preview.value = URL.createObjectURL(input.files[0]);
    picture.value = input.files[0];
  }
  emit("picture-selected", preview);
}

const emit = defineEmits(["picture-selected"]);
</script>

<template>
  <div>
    <div
      class="h-32 w-32 rounded-full bg-cover bg-center"
      :style="{
        backgroundImage: `url(${preview})`,
      }"
    ></div>
    <UInput type="file" accept=".jpg,.png," @change="handleFileSelect" />
  </div>
</template>
