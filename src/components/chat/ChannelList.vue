<script setup lang="ts">
import { router } from "@/main";
import type { ChannelModel } from "@/models";
import axios from "axios";
import { Plus } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const channels = ref<ChannelModel[]>([]);

axios
  .get<ChannelModel[]>(`/api/channel/fetch?serverID=${route.params.server}`)
  .then(function (res) {
    channels.value = res.data;

    if (channels.value.length !== 0) {
      const lastChannel = localStorage.getItem(
        ("last-channel-on-" + route.params.server) as string
      );
      if (lastChannel) {
        selectChannel(lastChannel);
      } else {
        selectChannel(channels.value[0].id);
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });

function addChannel() {
  const name = "New Channel"; // temporary

  axios
    .post<ChannelModel>(
      `/api/channel/create?serverID=${route.params.server}&name=${name}`
    )
    .catch((error) => {
      console.error(error);
    });
}

function selectChannel(channelId: string) {
  if (isChannelSelected(channelId)) return;
  localStorage.setItem(
    ("last-channel-on-" + route.params.server) as string,
    channelId
  );
  router.push(`/chat/${route.params.server}/${channelId}`);
}

function isChannelSelected(channelId: string): boolean {
  if (channelId === route.params.channel) {
    return true;
  }
  return false;
}
</script>

<template>
  <div class="flex flex-col min-w-60 max-w-60 grow overflow-y-auto">
    <Top>
      <span>
        {{ route.params.server }}
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
