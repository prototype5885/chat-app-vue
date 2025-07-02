<script setup lang="ts">
import { router } from "@/main";
import type { ServerModel } from "@/models";
import { MsgPackDecode } from "@/services/messagepack";
import axios, { AxiosError } from "axios";
import { Mail } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";

import ConfirmPopup from "primevue/confirmpopup";
import CreateServer from "@/components/chat/CreateServer.vue";
import ServerBase from "@/components/chat/ServerBase.vue";
import Separator from "@/components/Separator.vue";
import { useToast } from "vue-toast-notification";

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

async function renameServer(serverID: bigint) {
  console.debug(`Renaming server ID ${serverID}`);
  axios
    .post(
      `/api/server/rename?serverID=${encodeURIComponent(String(serverID))}&name=${encodeURIComponent("new name")}`
    )
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}

async function deleteServer(serverID: bigint) {
  console.debug(`Deleting server ID ${serverID}`);
  axios
    .post(`/api/server/delete?serverID=${encodeURIComponent(String(serverID))}`)
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}

const confirmDeletion = (serverID: bigint) => {
  confirm.require({
    message: "Do you want to delete this server?",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      deleteServer(serverID);
    },
    reject: () => {},
  });
};
</script>

<template>
  <ConfirmPopup />
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

    <Separator class="w-8 py-2" />

    <!-- server list -->
    <ServerBase
      v-for="server in serverList"
      :key="server.id.toString()"
      :id="server.id"
      :name="server.name"
      :picture="server.picture"
      :ctx-items="[
        {
          label: 'Rename server',
          command: () => {
            renameServer(server.id);
          },
        },
        {
          separator: true,
        },
        {
          label: 'Delete server',
          command: () => {
            confirmDeletion(server.id);
          },
        },
      ]"
      :selected="isServerSelected(server.id)"
      @clicked="selectServer(server.id)"
    >
      <span v-if="server.picture == undefined || server.picture == ''">{{
        server.name[0].toUpperCase()
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
