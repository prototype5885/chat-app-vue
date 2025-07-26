<script setup lang="ts">
import { settingsStore } from "@/piniaStores";
import { CircleX } from "lucide-vue-next";

const settings = settingsStore();

const elements = [
  {
    label: "User Settings",
    children: [{ label: "My Account" }, { label: "Data" }],
  },
  {
    label: "App Settings",
    children: [{ label: "Language" }],
  },
];
</script>

<template>
  <div class="fixed flex h-full w-full z-50 select-none">
    <div class="bg-black/20 flex justify-end w-1/3 p-2">
      <div>
        <div v-for="element in elements" :key="element.label">
          <h1 class="ml-2 uppercase text-sm text-white/50">
            {{ element.label }}
          </h1>
          <button
            class="hover:bg-white/5 rounded-md w-full text-white/70 hover:text-white p-2 transition-colors duration-200 text-left"
            v-if="element.children"
            v-for="child in element.children"
          >
            {{ child.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="w-2/5">
      <h1>test</h1>
    </div>
    <div>
      <button class="" @click="settings.visibility = false">
        <CircleX
          class="m-2 stroke-white/50 hover:stroke-white"
          :size="40"
          :stroke-width="1"
        />
      </button>
    </div>
  </div>
</template>
