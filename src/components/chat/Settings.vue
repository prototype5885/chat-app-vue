<script setup lang="ts">
import Dialog from "primevue/dialog";
import { settingsStore } from "@/piniaStores.ts";

const settings = settingsStore();
</script>

<template>
  <Dialog v-model:visible="settings.visibility" header="Settings" maximizable>
    <div>test</div>
  </Dialog>
</template>
