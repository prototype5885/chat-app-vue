<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined;
    minRows: number;
    maxRows: number;
    placeholder: string;
  }>(),
  {
    modelValue: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "keydown", event: KeyboardEvent): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lineHeight = ref<number>(0);

onMounted(() => {
  if (textareaRef.value) {
    const style = window.getComputedStyle(textareaRef.value);
    lineHeight.value = parseInt(style.lineHeight);
    autoResize();
  }
});

watch(
  () => props.modelValue,
  () => nextTick(autoResize)
);

function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";

    const currentRows = Math.floor(
      textareaRef.value.scrollHeight / lineHeight.value
    );

    const rows = Math.max(props.minRows, Math.min(currentRows, props.maxRows));
    textareaRef.value.style.height = `${rows * lineHeight.value}px`;
    textareaRef.value.style.overflowY =
      rows >= props.maxRows ? "auto" : "hidden";
  }
}

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <textarea
    ref="textareaRef"
    :value="modelValue"
    @input="handleInput"
    class="resize-none overflow-y-hidden box-border grow my-3 outline-0 mx-2"
    :rows="1"
    :placeholder="placeholder"
    @keydown="$emit('keydown', $event)"
  ></textarea>
</template>
