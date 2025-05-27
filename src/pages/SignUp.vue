<script setup lang="ts">
import { router } from "@/main";
import { reactive, ref } from "vue";
import axios from "axios";
import type { ValidationErrorResponse } from "@/models.ts";

interface SignUpForm {
  email: string;
  password: string;
}

const registerForm = reactive<SignUpForm>({
  email: "",
  password: "",
});

const secondPassword = ref<string>("");

const errorResponse = ref<ValidationErrorResponse>();
const successResponse = ref<string>("");

const passwordError = ref<string>();

async function submit() {
  if (registerForm.password !== secondPassword.value) {
    passwordError.value = "Passwords entered don't match";
    return;
  }
  passwordError.value = "";

  await axios
    .post("/Api/Auth/register", registerForm)
    .then(function (resp) {
      errorResponse.value = undefined;
      successResponse.value = resp.statusText;
      router.push("/login");
    })
    .catch((e) => {
      errorResponse.value = e.response.data as ValidationErrorResponse;
    });
}
</script>

<template>
  <div>
    <UForm
      class="space-y-2 border rounded-2xl w-fit p-12"
      @submit.prevent="submit"
      :state="registerForm"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="registerForm.email"
          placeholder="Enter your email"
          class="w-64"
          type="email"
          required
        />
      </UFormField>
      <UFormField label="Password" name="password" required>
        <UInput
          v-model="registerForm.password"
          placeholder="Enter a password"
          class="w-64"
          type="password"
          required
        />
      </UFormField>
      <UFormField label="Password again" required>
        <UInput
          v-model="secondPassword"
          placeholder="Enter password again"
          class="w-64"
          type="password"
          required
        />
      </UFormField>
      <UButton type="submit">Sign up</UButton>
      <h1 class="text-green-500" v-if="successResponse">
        {{ successResponse }}
      </h1>
      <h1 class="text-red-500">{{ passwordError }}</h1>
      <h1
        class="text-red-500"
        v-if="errorResponse"
        v-for="error in errorResponse.errors"
      >
        {{ error[0] }}
      </h1>
      <div>
        <ULink to="/login">Already have an account?</ULink>
      </div>
    </UForm>
  </div>
</template>
