<script setup lang="ts">
import { router } from "@/main";
</script>

<template>
  <div class="space-x-4">
    <UButton
      label="Sign up"
      @click="
        () => {
          router.push(`/register`);
        }
      "
    />
    <UButton
      label="Chat"
      @click="
        () => {
          router.push(`/chat`);
        }
      "
    />
  </div>
</template>
