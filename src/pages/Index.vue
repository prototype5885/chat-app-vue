<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { router } from "@/main";
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";
import axios from "axios";

const mode = useColorMode();

const loggedIn = ref<boolean>(false);

axios
  .get("/Api/IsLoggedIn")
  .then(function (response) {
    console.log(response.status);
    if (response.status === 200) {
      loggedIn.value = true;
    }
  })
  .catch((e) => {
    loggedIn.value = false;
  });

const items = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    to: "/home",
  },
  {
    label: "About",
    to: "/about",
  },
]);
</script>

<template>
  <div class="flex flex-col h-screen p-4">
    <header class="flex flex-row w-full justify-center space-x-4">
      <UNavigationMenu :items="items"></UNavigationMenu>
      <UButton
        :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        @click="mode = mode === 'dark' ? 'light' : 'dark'"
      />
      <UButton
        v-if="loggedIn"
        label="Open chat"
        @click="
          () => {
            router.push('/chat');
          }
        "
      />
      <UButton
        v-else
        label="Login"
        @click="
          () => {
            router.push('/login');
          }
        "
      />
    </header>
    <RouterView class="flex justify-center items-center flex-1" />
    <footer>hi</footer>
  </div>
</template>
