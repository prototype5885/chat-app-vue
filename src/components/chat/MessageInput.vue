<script setup lang="ts">
import { ref, watch } from "vue";
import axios, { AxiosError } from "axios";
import type { AddMessageModel } from "@/models";
import { MsgPackEncode } from "@/services/messagepack";
import AddAttachment from "@/components/icons/AddAttachment.vue";
import MessageTyping from "@/components/chat/MessageTyping.vue";
import AutoResizeTextarea from "@/components/AutoResizeTextarea.vue";
import { useToast } from "vue-toast-notification";

const chatInput = ref<string>();
const typing = ref<boolean>(false);

const props = defineProps<{
  channelId: string | undefined;
}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
};

watch(chatInput, () => {
  if (chatInput.value !== "") {
    typing.value = true;
  } else {
    typing.value = false;
  }
});

function sendMsg() {
  if (props.channelId === undefined || props.channelId === "") {
    console.error("There is no channel to send the message to");
    return;
  }

  if (chatInput.value) {
    const message: AddMessageModel = {
      message: chatInput.value,
      channelID: BigInt(props.channelId),
    };

    axios
      .post("/api/message/create", MsgPackEncode(message))
      .then(() => {
        chatInput.value = "";
      })
      .catch((e: AxiosError) => {
        console.error(e);
        useToast().error(e.message);
      });
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex rounded-lg mx-4 bg-white/5 border border-white/10 overflow-hidden"
    >
      <button class="group flex justify-center items-center mx-2">
        <AddAttachment class="fill-gray-300 group-hover:fill-white size-7" />
      </button>
      <AutoResizeTextarea
        v-model="chatInput"
        :min-rows="1"
        :max-rows="12"
        placeholder="Message ..."
        @keydown="handleKeyDown"
      ></AutoResizeTextarea>
      <button @click="sendMsg" class="bg-black/10 p-2" @keydown="handleKeyDown">
        send
      </button>
    </div>
    <div class="min-h-6 max-h-6">
      <MessageTyping v-if="typing" user="user" />
    </div>
  </div>
</template>
