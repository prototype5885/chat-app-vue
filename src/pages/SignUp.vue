<script setup lang="ts">
import { reactive, ref } from "vue";
import axios, { AxiosError } from "axios";
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

const successResponse = ref<string>("");

async function submit() {
  emailError.value = "";
  passwordError.value = "";

  await axios
    .post<string>("/api/auth/register", registerForm)
    .then(function (resp) {
      if (resp.data === "confirm_email") {
        successResponse.value = "Check your email for confirmation";
      }
    })
    .catch((e: AxiosError) => {
      if (e.status === 400) {
        const response = e.response?.data as any;
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
        type="text"
        :error="emailError"
      />
      <FormInput
        v-model="registerForm.password"
        placeholder="Enter a password"
        type="password"
        autocomplete="new-password"
        :error="passwordError"
      />
      <FormInput
        v-model="registerForm.confirmPassword"
        placeholder="Enter the password again"
        type="password"
        autocomplete="new-password"
        :error="passwordError"
      />
      <MainButton label="Sign up" type="submit" />
      <h1 class="text-green-500" v-if="successResponse">
        {{ successResponse }}
      </h1>

      <div>
        <span>Already have an account?</span>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </form>
  </div>
</template>
