<script setup lang="ts">
import type { UserModel } from "@/models";
import axios, { AxiosError } from "axios";
import { onUnmounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import UserDisplay from "@/components/chat/UserDisplay.vue";

const props = defineProps<{
  channelId: string;
}>();

const controller = new AbortController();
const memberList = ref<UserModel[]>([]);
const loading = ref<boolean>(true);

console.debug(`Getting members of channel ID ${props.channelId}`);
axios
  .get<UserModel[]>("/api/members/fetch", {
    signal: controller.signal,
    params: {
      channelID: props.channelId,
    },
  })
  .then(function (res) {
    memberList.value = res.data;
    loading.value = false;
  })
  .catch((e: AxiosError) => {
    if (e.name == "CanceledError") {
      console.warn(
        "Switched channel too fast, aborting getting members for previous channel"
      );
    } else {
      console.error(e);
      useToast().error(e.message);
    }
  });

onUnmounted(() => {
  controller.abort();
});
</script>

<template>
  <div class="flex m-2">
    <h1 v-if="loading">Loading...</h1>
    <UserDisplay
      v-else
      v-for="member in memberList"
      :key="member.id"
      :display-name="member.displayName"
      :picture="member.picture"
      size="32"
      class="ctx-menu"
      ctx-type="user"
      :user-id="member.id"
    />
  </div>
</template>
