import { defineStore } from "pinia";

export const settingsStore = defineStore("settings", {
  state: () => ({
    visibility: false,
  }),
});

export const userInfoStore = defineStore("userInfo", {
  state: () => ({
    displayName: "",
  }),
});
