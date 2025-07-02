<script setup lang="ts">
import MainButton from "@/components/MainButton.vue";
import { router } from "@/main";
</script>

<template>
  <div class="space-x-4">
    <MainButton
      @click="
        () => {
          router.push(`/register`);
        }
      "
      label="Sign up"
    />
    <MainButton
      @click="
        () => {
          router.push(`/chat`);
        }
      "
      label="Chat"
    />
  </div>
</template>
