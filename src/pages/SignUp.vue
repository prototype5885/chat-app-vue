<script setup lang="ts">
import { router } from "@/main";
import { reactive, ref } from "vue";
import axios, { AxiosError } from "axios";
import { MsgPackDecode, MsgPackEncode } from "@/services/messagepack";
import { ErrorToast } from "@/services/macros";

interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const registerForm = reactive<SignUpForm>({
  email: "",
  password: "",
  confirmPassword: "",
});

const emailError = ref<string>("");
const passwordError = ref<string>("");

async function submit() {
  emailError.value = "";
  passwordError.value = "";

  await axios
    .post("/api/auth/register", MsgPackEncode(registerForm), {
      responseType: "arraybuffer",
    })
    .then(function (resp) {
      router.push("/login");
    })
    .catch((e: AxiosError) => {
      if (e.status === 400) {
        const response = MsgPackDecode(e.response?.data as Uint8Array);
        emailError.value = response["Email"];
        passwordError.value = response["Password"];
      } else {
        ErrorToast(e.message);
      }
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
      <UFormField label="Email" required :error="emailError">
        <UInput
          v-model="registerForm.email"
          placeholder="Enter your email"
          class="w-64"
        />
      </UFormField>
      <UFormField label="Password" required :error="passwordError">
        <UInput
          v-model="registerForm.password"
          placeholder="Enter a password"
          class="w-64"
          type="password"
        />
      </UFormField>
      <UFormField label="Password again" required :error="passwordError">
        <UInput
          v-model="registerForm.confirmPassword"
          placeholder="Enter password again"
          class="w-64"
          type="password"
        />
      </UFormField>
      <UButton type="submit" loading-auto trailing>Sign up</UButton>
      <div>
        <ULink to="/login">Already have an account?</ULink>
      </div>
    </UForm>
  </div>
</template>
