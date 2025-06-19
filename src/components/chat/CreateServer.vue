<script setup lang="ts">
import type { ServerModel } from "@/models";
import { MsgPackDecode } from "@/services/messagepack";
import axios from "axios";
import { Plus } from "lucide-vue-next";
import { onUpdated, reactive, ref } from "vue";

const serverList = defineModel<ServerModel[]>({ required: true });

interface CreateServerForm {
  name: string;
  picture: File | null;
}

const createServer = reactive<CreateServerForm>({
  name: "",
  picture: null,
});

const modalOpen = ref<boolean>(false);
const errorText = ref<string>("");

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
    .post<Uint8Array>(
      `/api/server/create?name=${encodeURIComponent(createServer.name)}`,
      formData,
      { responseType: "arraybuffer" }
    )
    .then(function (response) {
      const server = MsgPackDecode(response.data) as ServerModel;
      serverList.value.push(server);
      modalOpen.value = false;
      emit("created-server", server.id);
    })
    .catch((error) => {
      console.error("Error adding server", error.response.statusText);
      errorText.value = error.response.statusText;
    });
}
</script>

<template>
  <UModal title="Create Server" description=" " v-model:open="modalOpen">
    <ServerBase name="Add a server" :selected="false" pic="" :ctx-items="[]">
      <Plus />
    </ServerBase>
    <template #body>
      <ProfilePicUploader v-model="createServer.picture" />
      <UForm class="space-y-2" @submit.prevent="submit" :state="createServer">
        <UFormField label="Name" required>
          <UInput
            v-model="createServer.name"
            placeholder="Server name"
            :maxlength="64"
            required
          />
        </UFormField>
        <UButton
          type="submit"
          loading-auto
          trailing
          :disabled="createServer.name === '' ? true : false"
          >Create</UButton
        >
      </UForm>
      <span class="text-red-500">{{ errorText }}</span>
    </template>
  </UModal>
</template>
