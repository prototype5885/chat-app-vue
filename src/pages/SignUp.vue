<script setup lang="ts">
import { router } from "@/main";
import { reactive, ref } from "vue";
import axios, { AxiosError } from "axios";
import { MsgPackDecode, MsgPackEncode } from "@/services/messagepack";
import { useToast } from "vue-toast-notification";
import MainButton from "@/components/MainButton.vue";
import FormInput from "@/components/FormInput.vue";
import { RouterLink } from "vue-router";

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
        console.error(e);
        useToast().error(e.message);
      }
    });
}
</script>

<template>
  <div>
    <form
      class="space-y-2 border rounded-2xl w-fit p-12 flex flex-col"
      @submit.prevent="submit"
      :state="registerForm"
    >
      <FormInput
        v-model="registerForm.email"
        placeholder="Enter your email"
        :error="emailError"
      />
      <FormInput
        v-model="registerForm.password"
        placeholder="Enter a password"
        :error="passwordError"
      />
      <FormInput
        v-model="registerForm.confirmPassword"
        placeholder="Enter the password again"
        :error="passwordError"
      />
      <MainButton label="Sign up" type="submit" />

      <div>
        <span>Already have an account?</span>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </form>
  </div>
</template>
