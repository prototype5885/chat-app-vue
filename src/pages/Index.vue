<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { router } from "@/main";
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";
import axios, { AxiosError } from "axios";
import { ErrorToast } from "@/services/macros";

const mode = useColorMode();

const loggedIn = ref<boolean>(false);
const loading = ref<boolean>(true);

axios
  .get("/api/isLoggedIn")
  .then(function (response) {
    if (response.status === 200) {
      loggedIn.value = true;
      loading.value = false;
    }
  })
  .catch((e: AxiosError) => {
    ErrorToast(e.message);
    loggedIn.value = false;
    loading.value = false;
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
  {
    label: "Test",
    to: "/test",
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
        :loading="loading"
        :label="loggedIn ? 'Open Chat' : 'Login'"
        @click="
          () => {
            if (loggedIn) {
              router.push('/chat');
            } else {
              router.push('/login');
            }
          }
        "
      />
    </header>
    <RouterView class="flex justify-center items-center flex-1" />
    <footer>hi</footer>
  </div>
</template>
