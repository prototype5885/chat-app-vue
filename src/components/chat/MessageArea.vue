<script setup lang="ts">
import type { MessageModel } from "@/models.ts";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import axios, { AxiosError } from "axios";
import { WebSocketService } from "@/services/websocketService";
import { MsgPackDecode } from "@/services/messagepack";
import { ErrorToast } from "@/services/macros";

const props = defineProps<{
  channelId: string;
}>();

const controller = new AbortController();

const messageList = ref<MessageModel[]>([]);

const loading = ref<boolean>(true);
const endDiv = ref<HTMLDivElement | null | undefined>();

console.debug(`Getting message list for channel ID ${props.channelId}`);
axios
  .get<Uint8Array>(
    `/api/message/fetch?channelID=${encodeURIComponent(props.channelId)}`,
    {
      responseType: "arraybuffer",
      signal: controller.signal,
    }
  )
  .then(function (response) {
    messageList.value = MsgPackDecode(response.data) as MessageModel[];
    loading.value = false;
  })
  .catch((e: AxiosError) => {
    if (e.name == "CanceledError") {
      console.warn(
        "Switched channel too fast, aborting getting messages for previous channel"
      );
    } else {
      ErrorToast(e.message);
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
});

function messageAdded(message: MessageModel) {
  messageList.value.push(message);
}

onUnmounted(() => {
  WebSocketService.emitter.off("MessageCreated", messageAdded);
  controller.abort();
});
</script>

<template>
  <div class="grow overflow-y-auto">
    <ul class="py-3">
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
</template>
