<script setup lang="ts">
import { router } from "@/main";
import type { ServerModel } from "@/models";
import { MsgPackDecode } from "@/services/messagepack";
import axios, { AxiosError } from "axios";
import { Mail } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import CreateServer from "@/components/chat/CreateServer.vue";
import ServerBase from "@/components/chat/ServerBase.vue";
import Separator from "@/components/Separator.vue";
import { useToast } from "vue-toast-notification";
import { WebSocketService } from "@/services/websocketService";

const route = useRoute();
const confirm = useConfirm();

const DM: bigint = 100n;
const serverList = ref<ServerModel[]>([]);

console.debug("Getting list of servers...");
axios
  .get<Uint8Array>("/api/server/fetch", { responseType: "arraybuffer" })
  .then(function (response) {
    serverList.value = MsgPackDecode(response.data) as ServerModel[];
  })
  .catch((e: AxiosError) => {
    if (e.status === 401) {
      console.warn(e);
      router.push("/");
      return;
    }
    console.error(e);
    useToast().error(e.message);
  });

if (route.params.server === undefined || route.params.server === "") {
  console.warn("No server was provided as URL parameter, redirecting to DM...");
  selectServer(DM);
}

function isServerSelected(serverID: bigint): boolean {
  return serverID.toString() === String(route.params.server) ? true : false;
}

async function selectServer(serverID: bigint) {
  if (isServerSelected(serverID)) return;
  console.debug(`Selecting server ID ${serverID}`);
  await router.push(`/chat/${serverID}`);
}

onMounted(() => {
  WebSocketService.emitter.on("ServerDeleted", serverDeleted);
});

function serverDeleted(serverID: bigint) {
  serverList.value = serverList.value.filter(
    (server) => server.id !== serverID
  );
}

onUnmounted(() => {
  WebSocketService.emitter.on("ServerDeleted", serverDeleted);
});
</script>

<template>
  <ul class="flex flex-col items-center py-2">
    <!-- dm button -->
    <ServerBase
      name="DM"
      :selected="isServerSelected(DM)"
      @clicked="selectServer(DM)"
    >
      <Mail :size="32" :strokeWidth="1" />
    </ServerBase>

    <Separator class="w-8 py-2" />

    <!-- server list -->
    <ServerBase
      v-for="server in serverList"
      :key="server.id.toString()"
      :id="server.id"
      :name="server.name"
      :picture="server.picture"
      :selected="isServerSelected(server.id)"
      @clicked="selectServer(server.id)"
      class="ctx-menu"
      ctx-type="server"
      :server-id="server.id"
    >
      <span v-if="server.picture == undefined || server.picture == ''">{{
        server.name ? server.name[0].toUpperCase() : ""
      }}</span>
    </ServerBase>

    <Separator v-if="serverList.length !== 0" class="w-8 py-2" />

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
</template>
