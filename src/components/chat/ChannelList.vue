<script setup lang="ts">
import { router } from "@/main";
import type { ChannelModel } from "@/models";
import { WebSocketService } from "@/services/websocketService";
import axios, { AxiosError } from "axios";
import { Plus } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import Top from "./Top.vue";
import Channel from "./Channel.vue";
import { useToast } from "vue-toast-notification";

const route = useRoute();
const controller = new AbortController();

const props = defineProps<{
  serverId: string;
}>();

const channels = ref<ChannelModel[]>([]);

console.debug(`Getting channels for server ID ${props.serverId}`);
axios
  .get<ChannelModel[]>("/api/channel/fetch", {
    signal: controller.signal,
    params: {
      serverID: props.serverId,
    },
  })
  .then(function (res) {
    channels.value = res.data;

    if (channels.value.length !== 0 && channels.value[0]) {
      const lastChannel = localStorage.getItem(
        "last-channel-on-" + props.serverId
      );
      if (lastChannel) {
        selectChannel(lastChannel);
      } else {
        selectChannel(channels.value[0].id);
      }
    } else {
      console.warn(
        "There are no channels on the server? This shouldn't happen"
      );
    }
  })
  .catch((e: AxiosError) => {
    if (e.name == "CanceledError") {
      console.warn(
        "Switched server too fast, aborting getting channels for previous server"
      );
    } else {
      console.error(e);
      useToast().error(e.message);
    }
  });

function addChannel() {
  axios
    .post("/api/channel/create", null, {
      params: {
        serverID: props.serverId,
        name: "New Channel", // temporary
      },
    })
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}

async function selectChannel(channelID: string) {
  if (isChannelSelected(channelID)) return;
  localStorage.setItem("last-channel-on-" + props.serverId, channelID);
  console.debug(`Selecting channel ID ${channelID}`);
  await router.push(`/chat/${props.serverId}/${channelID}`);
}

function isChannelSelected(channelID: string): boolean {
  if (channelID === String(route.params.channel)) {
    return true;
  }
  return false;
}

onMounted(() => {
  WebSocketService.emitter.on("ChannelCreated", channelAdded);
});

function channelAdded(channel: ChannelModel) {
  channels.value.push(channel);
}

onUnmounted(() => {
  controller.abort();
  WebSocketService.emitter.off("ChannelCreated", channelAdded);
});
</script>

<template>
  <div class="flex flex-col min-w-60 max-w-60 grow overflow-y-auto">
    <Top>
      <span>
        {{ props.serverId }}
      </span>
    </Top>
    <div
      class="grow flex flex-col overflow-y-auto scrollbar-hover p-2 text-white/50"
    >
      <div class="flex flex-row justify-between">
        <span class="hover:text-white cursor-pointer">Text Channels</span>
        <div v-tooltip.top="'Create Channel'">
          <Plus class="hover:text-white cursor-pointer" @click="addChannel" />
        </div>
      </div>
      <ul class="flex flex-col">
        <Channel
          v-for="channel in channels"
          :key="channel.id"
          :id="channel.id"
          :name="channel.name"
          :selected="isChannelSelected(channel.id)"
          @channel-selected="selectChannel"
        />
      </ul>
    </div>
  </div>
</template>
