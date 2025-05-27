<script setup lang="ts">
import type { MessageModel } from "@/models.ts";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import axios from "axios";
import { SignalRService } from "@/services/signalRService";
import { useRoute } from "vue-router";

const route = useRoute();

const websocketChannel = `message/${route.params.channel}`;

const messageList = ref<MessageModel[]>([]);

const loading = ref<boolean>(true);
const endDiv = ref<HTMLDivElement | null | undefined>();

axios
  .get<MessageModel[]>("/Api/Message/All/" + route.params.channel)
  .then(function (response) {
    messageList.value = response.data;
    loading.value = false;
  })
  .catch((error) => {
    console.error(error);
  });

console.log(`SignalR listening on channel ${route.params.channel}`);
SignalRService.conn.on(websocketChannel, (data: MessageModel) => {
  messageList.value.push(data);
});

watch(
  () => messageList,
  async () => {
    await nextTick();
    endDiv?.value?.scrollIntoView({ behavior: "instant" });
  },
  { deep: true },
);

onBeforeUnmount(() => {
  SignalRService.conn.off(websocketChannel);
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
        :user-id="msg.userId"
        name="name"
        pic=""
        :msg="msg.msg"
      ></Message>
      <li ref="endDiv"></li>
    </ul>
  </div>

  <MessageInput />
</template>
