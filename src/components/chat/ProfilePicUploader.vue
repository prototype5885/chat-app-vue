<script setup lang="ts">
import { Pencil } from "lucide-vue-next";
import { ref, onUnmounted } from "vue";

const props = defineProps<{
  picture?: string | undefined;
}>();

const preview = ref<string>(
  props.picture ? `"/cdn/avatars/${props.picture}"` : ""
);
const selectedPicture = defineModel<File | null>({ default: null });

let lastBlobUrl = "";

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp"
    ) {
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
      }
      lastBlobUrl = URL.createObjectURL(file);
      preview.value = lastBlobUrl;
      selectedPicture.value = file;
    } else {
      console.warn("Unsupported file format");
    }
  }
}

onUnmounted(() => {
  if (lastBlobUrl) {
    URL.revokeObjectURL(lastBlobUrl);
  }
});
</script>

<template>
  <div class="relative h-32 w-32 rounded-full overflow-hidden group">
    <div
      class="absolute inset-0 bg-center bg-cover"
      :style="
        preview
          ? `background-image: url(${preview});`
          : 'background-color: rgba(0,0,0,0.4);'
      "
    ></div>
    <div
      class="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 duration-200 pointer-events-none"
    >
      <Pencil class="h-6 w-6" />
    </div>
    <input
      type="file"
      accept=".jpg,.png,.webp"
      @change="handleFileSelect"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
  </div>
</template>
