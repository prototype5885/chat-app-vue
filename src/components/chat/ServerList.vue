<script setup lang="ts">
import { router } from "@/main";
import type { ServerModel } from "@/models";
import { MsgPackDecode } from "@/services/messagepack";
import axios from "axios";
import { Mail } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const DM: bigint = 100n;
const serverList = ref<ServerModel[]>([]);

console.debug("Getting list of servers...");
axios
  .get<Uint8Array>("/api/server/fetch", { responseType: "arraybuffer" })
  .then(function (response) {
    serverList.value = MsgPackDecode(response.data) as ServerModel[];
  })
  .catch((error) => {
    console.error(error);
    if (error.response.status === 401) {
      router.push("/");
      return;
    }
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
</script>

<template>
  <ul class="flex flex-col items-center py-2">
    <!-- dm button -->
    <ServerBase
      name="DM"
      :selected="isServerSelected(DM)"
      @clicked="selectServer(DM)"
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
</template>
