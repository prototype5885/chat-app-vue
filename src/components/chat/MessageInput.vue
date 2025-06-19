<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import type { AddMessageModel } from "@/models";
import { useRoute } from "vue-router";
import { MsgPackEncode } from "@/services/messagepack";

const channelId = useRoute().params.channel as string;

const chatInput = ref<string>();
const typing = ref<boolean>(false);

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
  if (chatInput.value) {
    const message: AddMessageModel = {
      message: chatInput.value,
      channelID: BigInt(channelId),
    };

    axios
      .post("/api/message/create", MsgPackEncode(message))
      .then(() => {
        chatInput.value = "";
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex rounded-lg mx-4 bg-white/5 border border-white/10">
      <button class="group flex justify-center items-center mx-2">
        <AddAttachment class="fill-gray-300 group-hover:fill-white size-7" />
      </button>
      <UTextarea
        v-model="chatInput"
        class="grow py-2"
        placeholder="Message ..."
        :rows="1"
        autoresize
        variant="none"
        :maxrows="16"
        :ui="{
          base: 'text-white resize-none',
        }"
        @keydown="handleKeyDown"
      ></UTextarea>
      <UButton @click="sendMsg">send</UButton>
    </div>
    <div class="min-h-6 max-h-6">
      <MessageTyping v-if="typing" user="user" />
    </div>
  </div>
</template>
