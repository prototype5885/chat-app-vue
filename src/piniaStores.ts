import { defineStore } from "pinia";

export const settingsStore = defineStore("settings", {
  state: () => ({
    visibility: false,
  }),
});
