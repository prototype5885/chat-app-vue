<script setup lang="ts">
import { router } from "@/main";
import type { ChannelModel } from "@/models";
import { MsgPackDecode } from "@/services/messagepack";
import { WebSocketService } from "@/services/websocketService";
import axios from "axios";
import { Plus } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const controller = new AbortController();

const props = defineProps<{
  serverId: string;
}>();

const channels = ref<ChannelModel[]>([]);

console.debug(`Getting channels for server ID ${props.serverId}`);
axios
  .get<Uint8Array>(
    `/api/channel/fetch?serverID=${encodeURIComponent(props.serverId)}`,
    {
      responseType: "arraybuffer",
      signal: controller.signal,
    }
  )
  .then(function (res) {
    channels.value = MsgPackDecode(res.data) as ChannelModel[];

    if (channels.value.length !== 0) {
      const lastChannel = localStorage.getItem(
        "last-channel-on-" + props.serverId
      );
      if (lastChannel) {
        selectChannel(BigInt(lastChannel));
      } else {
        selectChannel(channels.value[0].id);
      }
    }
  })
  .catch((error: Error) => {
    if (error.name == "CanceledError") {
      console.warn(
        "Switched server too fast, aborting getting channels for previous server"
      );
    } else {
      console.error(error.name);
    }
  });

function addChannel() {
  const currentServer = encodeURIComponent(props.serverId);
  const channelName = encodeURIComponent("New Channel"); // temporary

  axios
    .post(`/api/channel/create?serverID=${currentServer}&name=${channelName}`)
    .catch((error) => {
      console.error(error);
    });
}

async function selectChannel(channelID: bigint) {
  if (isChannelSelected(channelID)) return;
  localStorage.setItem(
    "last-channel-on-" + props.serverId,
    channelID.toString()
  );
  console.debug(`Selecting channel ID ${channelID}`);
  await router.push(`/chat/${props.serverId}/${channelID}`);
}

function isChannelSelected(channelID: bigint): boolean {
  if (channelID.toString() === String(route.params.channel)) {
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
        <UPopover mode="hover" arrow :content="{ side: 'top' }">
          <Plus class="hover:text-white cursor-pointer" @click="addChannel" />
          <template #content>Create channel</template>
        </UPopover>
      </div>
      <ul class="flex flex-col">
        <Channel
          v-for="channel in channels"
          :id="channel.id"
          :name="channel.name"
          :selected="isChannelSelected(channel.id)"
          @channel-selected="selectChannel"
        />
      </ul>
    </div>
  </div>
</template>
