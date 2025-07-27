<script setup lang="ts">
import { reactive, ref } from "vue";
import ProfilePicUploader from "@/components/chat/ProfilePicUploader.vue";
import axios, { AxiosError } from "axios";
import { useToast } from "vue-toast-notification";
import { userInfoStore } from "@/piniaStores";
import InputText from "primevue/inputtext";

interface UpdateUserSettingsForm {
  displayName: string;
  picture: File | null;
}

const userInfo = userInfoStore();

const userSettings = reactive<UpdateUserSettingsForm>({
  displayName: userInfo.displayName,
  picture: null,
});

function submit() {
  let formData = new FormData();
  if (userSettings.picture != null) {
    formData.set("picture", userSettings.picture);
  } else {
    formData == null;
  }

  axios
    .post<Uint8Array>(
      `/api/user/update?displayName=${encodeURIComponent(userSettings.displayName)}`,
      formData,
      { responseType: "arraybuffer" }
    )
    .then(function (response) {})
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}

function IsThereAnyChange(): boolean {
  if (userSettings.displayName === "") return false;
  if (userSettings.displayName === userInfo.displayName) return false;
  return true;
}
</script>

<template>
  <div>
    <ProfilePicUploader v-model="userSettings.picture" />
    <br />
    <form class="flex flex-col" @submit.prevent="submit" :state="userSettings">
      <label for="displayName">Display name</label>
      <input
        v-model="userSettings.displayName"
        id="displayname"
        :maxlength="64"
        required
        class="outline-1"
      />
      <br />
      <button
        type="submit"
        :disabled="!IsThereAnyChange()"
        class="bg-black/50 disabled:bg-black/20"
      >
        Save
      </button>
    </form>
  </div>
</template>
