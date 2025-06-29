<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { router } from "@/main";
import { reactive, ref } from "vue";
import { MsgPackEncode } from "@/services/messagepack";
import { ErrorToast } from "@/services/macros";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const rememberMe = ref<boolean>(false);

async function submit() {
  let path = "/api/auth/login";

  if (rememberMe.value === true) {
    path += "?rememberMe=true";
  }

  await axios
    .post(path, MsgPackEncode(loginForm), {
      responseType: "arraybuffer",
    })
    .then(function (response) {
      if (response.status === 200) {
        router.push("/chat");
      }
    })
    .catch((e: AxiosError) => {
      ErrorToast(e.message);
    });
}
</script>

<template>
  <div>
    <UForm
      class="space-y-2 border rounded-2xl w-fit p-12"
      @submit.prevent="submit"
      :state="loginForm"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="loginForm.email"
          placeholder="Enter your email"
          class="w-64"
        />
      </UFormField>
      <UFormField label="Password" name="password" required>
        <UInput
          v-model="loginForm.password"
          placeholder="Enter your password"
          class="w-64"
          type="password"
        />
      </UFormField>
      <UCheckbox v-model="rememberMe" label="Remember me" />
      <UButton type="submit" loading-auto trailing>Login</UButton>
      <div>
        <span>No account?</span>
        <ULink to="/register">Register</ULink>
      </div>
    </UForm>
  </div>
</template>
