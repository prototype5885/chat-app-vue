<script setup lang="ts">
import { router } from "@/main";
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";
import axios, { AxiosError } from "axios";
import { useToast } from "vue-toast-notification";
import MainButton from "@/components/MainButton.vue";
import { RouterLink } from "vue-router";

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
    if (e.status === 401) {
      console.warn(e);
    } else {
      console.error(e);
      useToast().error(e.message);
    }

    loggedIn.value = false;
    loading.value = false;
  });
</script>

<template>
  <div class="flex flex-col h-screen p-4">
    <header class="flex flex-row w-full justify-center space-x-4">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/test">Test</RouterLink>

      <MainButton
        :loading="loading"
        @click="
          () => {
            if (loggedIn) {
              router.push('/chat');
            } else {
              router.push('/login');
            }
          }
        "
        :label="loggedIn ? 'Open Chat' : 'Login'"
      />
    </header>
    <RouterView class="flex justify-center items-center flex-1" />
    <footer>hi</footer>
  </div>
</template>
