<script setup lang="ts">
import type { MessageModel } from "@/models.ts";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { WebSocketService } from "@/services/websocketService";
import { MsgPackDecode } from "@/services/messagepack";

const route = useRoute();

const messageList = ref<MessageModel[]>([]);

const loading = ref<boolean>(true);
const endDiv = ref<HTMLDivElement | null | undefined>();

axios
  .get<Uint8Array>(
    `/api/message/fetch?channelID=${encodeURIComponent(String(route.params.channel))}`,
    {
      responseType: "arraybuffer",
    }
  )
  .then(function (response) {
    messageList.value = MsgPackDecode(response.data) as MessageModel[];
    loading.value = false;
  })
  .catch((error) => {
    console.error(error);
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
});

function messageAdded(message: MessageModel) {
  messageList.value.push(message);
}

onUnmounted(() => {
  WebSocketService.emitter.off("MessageCreated", messageAdded);
});
</script>

<template>
  <div class="grow overflow-y-auto">
    <span v-if="loading">Loading...</span>
    <ul v-else class="py-3">
      <Message
        v-for="(msg, index) in messageList"
        :key="index"
        class="py-2"
        :message-id="msg.id"
        :user-id="msg.userID"
        name="name"
        pic=""
        :msg="msg.message"
      ></Message>
      <li ref="endDiv"></li>
    </ul>
  </div>

  <MessageInput />
</template>
