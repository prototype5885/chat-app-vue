<script setup lang="ts">
import type { UserModel } from "@/models";
import axios, { AxiosError } from "axios";
import { Settings } from "lucide-vue-next";
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import Avatar from "@/components/Avatar.vue";
import { settingsStore } from "@/piniaStores.ts";

const user = ref<UserModel>({
  id: "0",
  displayName: "",
  picture: "",
});

const settings = settingsStore();

axios
  .get<UserModel>("/api/user/fetch?userID=self")
  .then(function (res) {
    user.value = res.data;
  })
  .catch((e: AxiosError) => {
    console.error(e);
    useToast().error(e.message);
  });
</script>

<template>
  <div class="flex items-center h-full px-2 min-h-14 max-h-14 bg-black/35">
    <button class="w-3/5 flex items-center hover-bg hover:rounded-lg p-1">
      <Avatar size="40" :pic="user.picture" :name="user.displayName" />
      <div class="flex flex-col items-start ml-2">
        <span class="text-sm">{{ user.displayName }}</span>
        <span class="text-xs">Status</span>
      </div>
    </button>

    <div class="w-2/5 flex justify-evenly">
      <button
        class="hover-bg hover:rounded-lg"
        v-tooltip.top="'User Settings'"
        @click="settings.visibility = true"
      >
        <Settings stroke-width="1" class="m-1" />
      </button>
    </div>
  </div>
</template>
