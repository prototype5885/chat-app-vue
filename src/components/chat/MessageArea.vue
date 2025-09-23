<script setup lang="ts">
import type { MessageModel } from "@/models.ts";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import axios, { AxiosError } from "axios";
import { WebSocketService } from "@/services/websocketService";
import GhostMessages from "./GhostMessages.vue";
import Message from "./Message.vue";
import { useToast } from "vue-toast-notification";

const props = defineProps<{
  channelId: string;
}>();

const controller = new AbortController();

const messageList = ref<MessageModel[]>([]);

const loading = ref<boolean>(true);
const endDiv = ref<HTMLDivElement | null | undefined>();

console.debug(`Getting message list for channel ID ${props.channelId}`);
axios
  .get<MessageModel[]>("/api/message/fetch", {
    signal: controller.signal,
    params: {
      channelID: props.channelId,
    },
  })
  .then(function (res) {
    messageList.value = res.data;
    loading.value = false;
  })
  .catch((e: AxiosError) => {
    if (e.name == "CanceledError") {
      console.warn(
        "Switched channel too fast, aborting getting messages for previous channel"
      );
    } else {
      console.error(e);
      useToast().error(e.message);
    }
  });

watch(
  () => messageList,
  async () => {
    await nextTick();
    endDiv?.value?.scrollIntoView({ behavior: "instant" });
  },
  { deep: true }
);

onMounted(() => {
  WebSocketService.emitter.on("MessageCreated", messageAdded);
  WebSocketService.emitter.on("MessageDeleted", messageDeleted);
});

function messageAdded(message: MessageModel) {
  messageList.value.push(message);
}

function messageDeleted(messageID: string) {
  for (let i = 0; i < messageList.value.length; i++) {
    if (messageList.value[i]?.id === messageID) {
      messageList.value.splice(i, 1);
      return;
    }
  }
}

onUnmounted(() => {
  WebSocketService.emitter.off("MessageCreated", messageAdded);
  WebSocketService.emitter.off("MessageDeleted", messageDeleted);
  controller.abort();
});
</script>

<template>
  <div class="grow overflow-y-auto py-3">
    <h1 v-if="loading">
      <GhostMessages />
    </h1>
    <ul v-else>
      <Message
        v-for="(msg, index) in messageList"
        :key="index"
        class="py-2"
        :message-id="msg.id"
        :user-id="msg.userID"
        :name="msg.user.displayName"
        :pic="msg.user.picture"
        :msg="msg.message"
      ></Message>
      <li ref="endDiv"></li>
    </ul>
  </div>
</template>
