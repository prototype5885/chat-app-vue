<script setup lang="ts">
import { reactive, ref } from "vue";
import ProfilePicUploader from "@/components/chat/ProfilePicUploader.vue";
import axios, { AxiosError } from "axios";
import { useToast } from "vue-toast-notification";
import { MsgPackDecode } from "@/services/messagepack";
import type { UserModel } from "@/models";

interface UpdateUserSettingsForm {
  displayName: string;
  picture: File | null;
}

const newUserInfo = reactive<UpdateUserSettingsForm>({
  displayName: "",
  picture: null,
});

const existingUserInfo = ref<UserModel>({
  id: 0n,
  displayName: "",
  picture: "",
});

await axios
  .get<Uint8Array>("/api/user/fetch?userID=self", {
    responseType: "arraybuffer",
  })
  .then(function (res) {
    existingUserInfo.value = MsgPackDecode(res.data) as UserModel;
    newUserInfo.displayName = existingUserInfo.value.displayName;
  })
  .catch((e: AxiosError) => {
    console.error(e);
    useToast().error(e.message);
  });

function submit() {
  const formData = new FormData();
  if (newUserInfo.picture != null) {
    formData.append("picture", newUserInfo.picture);
  } else {
    formData == null;
  }

  let params = new URLSearchParams();
  if (NameChanged()) params.append("displayName", newUserInfo.displayName);

  axios
    .post<Uint8Array>("/api/user/update", formData, {
      responseType: "arraybuffer",
      params: params,
    })
    .then(function (response) {
      useToast().success(response.statusText);
    })
    .catch((e: AxiosError) => {
      console.error(e);
      useToast().error(e.message);
    });
}

function NameChanged(): boolean {
  if (
    newUserInfo.displayName !== "" &&
    newUserInfo.displayName !== existingUserInfo.value.displayName
  )
    return true;
  return false;
}

function PictureChanged(): boolean {
  if (newUserInfo.picture !== null) return true;
  return false;
}

function IsThereAnyChange(): boolean {
  if (NameChanged()) return true;
  if (PictureChanged()) return true;

  return false;
}
</script>

<template>
  <div>
    <h1>Profile picture {{ PictureChanged() ? "(Modified)" : "" }}</h1>

    <ProfilePicUploader
      v-model="newUserInfo.picture"
      :picture="existingUserInfo.picture"
    />
    <br />
    <form class="flex flex-col" @submit.prevent="submit" :state="newUserInfo">
      <label for="displayName"
        >Display name {{ NameChanged() ? "(Modified)" : "" }}</label
      >
      <input
        v-model="newUserInfo.displayName"
        id="displayname"
        :maxlength="64"
        required
        class="outline-1"
      />
      <br />
      <button
        type="submit"
        :disabled="!IsThereAnyChange()"
        class="bg-blue-500 rounded disabled:bg-black/20"
      >
        Submit
      </button>
    </form>
  </div>
</template>
