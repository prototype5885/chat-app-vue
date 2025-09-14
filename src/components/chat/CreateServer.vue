<script setup lang="ts">
import type { ServerModel } from "@/models";
import axios, { AxiosError } from "axios";
import { Plus } from "lucide-vue-next";
import { onUpdated, reactive, ref } from "vue";
import ServerBase from "@/components/chat/ServerBase.vue";
import ProfilePicUploader from "@/components/chat/ProfilePicUploader.vue";
import Dialog from "primevue/dialog";
import { useToast } from "vue-toast-notification";

const serverList = defineModel<ServerModel[]>({ required: true });

interface CreateServerForm {
  name: string;
  picture: File | null;
}

const createServer = reactive<CreateServerForm>({
  name: "",
  picture: null,
});

const editWindowVisible = ref<boolean>(false);

const emit = defineEmits(["created-server"]);

// this make sure the form field is reseted every time modal is opened
onUpdated(() => {
  createServer.name = "";
});

function submit() {
  let formData = new FormData();
  if (createServer.picture != null) {
    formData.set("picture", createServer.picture);
  }

  axios
    .post<ServerModel>("/api/server/create", formData, {
      params: {
        name: createServer.name,
      },
    })
    .then(function (res) {
      const server = res.data;
      serverList.value.push(server);
      editWindowVisible.value = false;
      emit("created-server", server.id);
    })
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}
</script>

<template>
  <ServerBase
    name="Add a server"
    :selected="false"
    pic=""
    :ctx-items="[]"
    @clicked="editWindowVisible = true"
  >
    <Plus />
    <Dialog
      v-model:visible="editWindowVisible"
      header="Create server"
      pt:mask:class="backdrop-brightness-50"
      modal
    >
      <ProfilePicUploader v-model="createServer.picture" />
      <form
        class="flex flex-col"
        @submit.prevent="submit"
        :state="createServer"
      >
        <input
          v-model="createServer.name"
          placeholder="Server name"
          :maxlength="64"
          required
          class="outline-1"
        />
        <br />
        <button
          type="submit"
          :disabled="createServer.name === '' ? true : false"
          class="bg-black/50 disabled:bg-black/20"
        >
          Create
        </button>
      </form>
    </Dialog>
  </ServerBase>
</template>
