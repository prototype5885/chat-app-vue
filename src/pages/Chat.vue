<script setup lang="ts">
import { router } from "@/main";
import axios, { AxiosError } from "axios";
import { onBeforeUnmount } from "vue";
import { WebSocketService } from "@/services/websocketService";
import MessageArea from "@/components/chat/MessageArea.vue";
import MessageInput from "@/components/chat/MessageInput.vue";
import Top from "@/components/chat/Top.vue";
import ServerList from "@/components/chat/ServerList.vue";
import ChannelList from "@/components/chat/ChannelList.vue";
import UserPanel from "@/components/chat/UserPanel.vue";
import Settings from "@/components/chat/Settings.vue";

const theme = "diskord";

const props = defineProps({
  server: String,
  channel: String,
});

console.debug("Getting session ID cookie...");
await axios.get("/api/auth/newSession").catch((e: AxiosError) => {
  console.error(e);
  router.push("/");
  return;
});

console.debug("Connecting to websocket...");
await WebSocketService.connect().catch((e: AxiosError) => {
  console.error(e);
  router.push("/");
  return;
});

onBeforeUnmount(() => {
  WebSocketService.Disconnect();
});
</script>

<template>
  <Settings :visibility="true" />
  <div class="flex flex-row h-screen select-none" :class="`theme-${theme}`">
    <!-- server list -->
    <div class="min-w-18 max-w-18 bg-black/45 overflow-y-auto scrollbar-hidden">
      <ServerList />
    </div>

    <!-- channel/friend list -->
    <div class="flex flex-col min-w-60 max-w-60 h-screen grow">
      <div class="flex grow overflow-y-auto bg-black/20">
        <ChannelList
          v-if="props.server"
          :key="props.server"
          :server-id="props.server"
        />
      </div>
      <UserPanel />
    </div>

    <!-- chat messages -->
    <div class="flex flex-col h-screen grow">
      <Top>{{ props.channel }}</Top>
      <div class="flex grow overflow-y-auto">
        <MessageArea
          v-if="props.channel"
          :key="props.channel"
          :channel-id="props.channel"
        />
      </div>

      <MessageInput :key="props.channel" :channel-id="props.channel" />
    </div>

    <!-- members -->
    <div class="min-w-64 w-64 flex flex-col">
      <Top>above members</Top>
      <div class="bg-black/20 flex-1"></div>
    </div>
  </div>
</template>
