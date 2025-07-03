<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { router } from "@/main";
import { reactive, ref } from "vue";
import { MsgPackEncode } from "@/services/messagepack";
import { useToast } from "vue-toast-notification";
import MainButton from "@/components/MainButton.vue";
import { RouterLink } from "vue-router";
import FormInput from "@/components/FormInput.vue";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const rememberMe = ref<boolean>(false);

const errorResponse = ref<string>("");

async function submit() {
  errorResponse.value = "";
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
      console.error(e);
      if (e.isAxiosError && e.status === 401) {
        errorResponse.value = "Wrong email or password";
      }
      useToast().error(e.message);
    });
}
</script>

<template>
  <div>
    <form
      class="space-y-2 border rounded-2xl w-fit p-12"
      @submit.prevent="submit"
      :state="loginForm"
    >
      <FormInput
        v-model="loginForm.email"
        placeholder="Enter your email"
        autocomplete="email"
        type="text"
        class="w-64"
      />
      <FormInput
        v-model="loginForm.password"
        placeholder="Enter your password"
        autocomplete="current-password"
        type="password"
        class="w-64"
      />
      <h1 class="text-red-500">{{ errorResponse }}</h1>
      <div>
        <label>Remember me</label>
        <input type="checkbox" v-model="rememberMe" />
      </div>
      <MainButton type="submit" label="Login" />
      <div>
        <span>No account?</span>
        <RouterLink to="/register">Register</RouterLink>
      </div>
    </form>
  </div>
</template>
