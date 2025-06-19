<script setup lang="ts">
import type { ServerModel } from "@/models";
import { router } from "@/main";
import axios from "axios";
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Mail } from "lucide-vue-next";
import { WebSocketService } from "@/services/websocketService";
import { MsgPackDecode } from "@/services/messagepack";

const route = useRoute();

const DM: bigint = 100n;

const theme = "diskord";

const serverList = ref<ServerModel[]>([]);

// these are so channel list will re render when server changes
const serverKey = ref<string>(route.params.server as string);
watch(
  () => route.params.server,
  () => {
    serverKey.value = route.params.server as string;
  }
);

WebSocketService.connect();

console.log("Getting servers...");
axios
  .get<Uint8Array>("/api/server/fetch", { responseType: "arraybuffer" })
  .then(function (response) {
    serverList.value = MsgPackDecode(response.data) as ServerModel[];
  })
  .catch((error) => {
    console.error(error);
  });

function selectDm() {
  setCurrentServer(DM);
  console.log("Selected dm");
}

function selectServer(serverID: bigint) {
  setCurrentServer(serverID);
}

function isServerSelected(serverID: bigint): boolean {
  if (serverID.toString() === (route.params.server as string)) {
    return true;
  }
  return false;
}

function setCurrentServer(serverID: bigint) {
  if (serverID.toString() === (route.params.server as string)) {
    return;
  }
  router.push(`/chat/${serverID}`);
}

onBeforeUnmount(() => {
  WebSocketService.Disconnect();
});
</script>

<template>
  <div class="flex flex-row h-screen select-none" :class="`theme-${theme}`">
    <ul
      class="min-w-18 max-w-18 bg-black/45 overflow-y-auto scrollbar-hidden flex flex-col items-center py-2"
    >
      <!-- dm button -->
      <ServerBase
        name="DM"
        :selected="isServerSelected(DM)"
        @clicked="selectDm"
        :ctx-items="[]"
      >
        <Mail :size="32" :strokeWidth="1" />
      </ServerBase>

      <USeparator class="w-8 py-2" />

      <!-- server list -->
      <ServerBase
        v-for="server in serverList"
        :key="server.id.toString()"
        :id="server.id"
        :name="server.name"
        :picture="server.picture"
        :ctx-items="[
          [
            {
              label: 'Rename server',
            },
          ],
          [
            {
              label: 'Show Sidebar',
              kbds: ['meta', 's'],
            },
          ],
          [
            {
              label: 'Delete server',
              color: 'error' as const,
            },
          ],
        ]"
        :selected="isServerSelected(server.id)"
        @clicked="selectServer(server.id)"
      >
        <span v-if="server.picture == undefined || server.picture == ''">{{
          server.name[0].toUpperCase()
        }}</span>
      </ServerBase>

      <USeparator v-if="serverList.length !== 0" class="w-8 py-2" />

      <!-- add server button -->
      <CreateServer
        v-model="serverList"
        @created-server="
          (serverID: bigint) => {
            selectServer(serverID);
          }
        "
      />
    </ul>

    <div class="flex grow">
      <RouterView :key="serverKey" />
    </div>
  </div>
</template>
