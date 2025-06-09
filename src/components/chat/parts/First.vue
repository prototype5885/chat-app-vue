<script setup lang="ts">
import type { AddServerModel, ServerModel } from "@/models";
import { router } from "@/main";
import axios from "axios";
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { SignalRService } from "@/services/signalRService";

const route = useRoute();

const DM = "dm";
const ADD_SERVER = "add-server";

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

SignalRService.connect();

console.log("Getting servers...");
axios
  .get<ServerModel[]>("/api/server/all")
  .then(function (response) {
    serverList.value = response.data;
  })
  .catch((error) => {
    console.error(error);
  });

function selectDm() {
  setCurrentServer(DM);
  console.log("Selected dm");
}

function selectServer(serverId: string) {
  setCurrentServer(serverId);
}

function addServer() {
  const newServer: AddServerModel = {
    name: "new server",
  };

  axios
    .post<ServerModel>("/api/server", newServer)
    .then(function (response) {
      serverList.value.push(response.data);
    })
    .catch((error) => {
      console.error("Error adding server", error);
    });
}

function isServerSelected(id: string): boolean {
  if (id === route.params.server) {
    return true;
  }
  return false;
}

function setCurrentServer(serverId: string) {
  if (serverId === route.params.server) {
    return;
  }
  router.push(`/chat/${serverId}`);
}

onBeforeUnmount(() => {
  SignalRService.disconnect();
});
</script>

<template>
  <div class="flex flex-row h-screen select-none" :class="`theme-${theme}`">
    <ul
      class="min-w-18 max-w-18 bg-black/45 overflow-y-auto scrollbar-hidden flex flex-col items-center py-2"
    >
      <Server
        :server="{
          id: DM,
          ownerID: '',
          name: 'DM',
          picture: '',
          banner: '',
        }"
        :selected="isServerSelected(DM)"
        @select-server="selectDm"
      />
      <USeparator class="w-8 py-2" />
      <Server
        v-for="server in serverList"
        :key="server.id"
        :server="server"
        :selected="isServerSelected(server.id)"
        @select-server="selectServer(server.id)"
      />
      <USeparator v-if="serverList.length !== 0" class="w-8 py-2" />

      <Server
        :server="{
          id: ADD_SERVER,
          ownerID: '',
          name: 'Add a server',
          picture: '',
          banner: '',
        }"
        :selected="false"
        pic=""
        @select-server="addServer"
      />
    </ul>

    <div class="flex grow">
      <RouterView :key="serverKey" />
    </div>
  </div>
</template>
