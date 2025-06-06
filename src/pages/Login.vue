<script setup lang="ts">
import axios from "axios";
import { router } from "@/main";
import { reactive, ref } from "vue";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const rememberMe = ref<boolean>(false);

const errorResponse = ref<string>();

async function submit() {
  errorResponse.value = "";

  let path = "/api/auth/login";

  if (rememberMe.value === true) {
    path += "?rememberMe=true";
  }

  await axios
    .post(path, loginForm, {
      withCredentials: true,
    })
    .then(function (response) {
      if (response.status === 200) {
        router.push("/chat");
      }
    })
    .catch((error) => {
      errorResponse.value = error.response.statusText;
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
      <h1 class="text-red-500">{{ errorResponse }}</h1>
      <div>
        <span>No account?</span>
        <ULink to="/register">Register</ULink>
      </div>
    </UForm>
  </div>
</template>
