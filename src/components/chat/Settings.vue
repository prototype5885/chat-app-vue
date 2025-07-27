<script setup lang="ts">
import { settingsStore } from "@/piniaStores";
import { CircleX } from "lucide-vue-next";
import { ref, shallowRef } from "vue";
import UserSettings from "@/components/chat/settings/UserSettings.vue";
import LanguageSettings from "./settings/LanguageSettings.vue";
import AccountSettings from "./settings/AccountSettings.vue";

const settings = settingsStore();

const elements = [
  {
    label: "User Settings",
    children: [
      { label: "My Account", component: AccountSettings },
      { label: "Profile", component: UserSettings },
    ],
  },
  {
    label: "App Settings",
    children: [{ label: "Language", component: LanguageSettings }],
  },
];

const selectedLabel = ref<string>(elements[0].children[0].label);
const selectedComp = shallowRef(elements[0].children[0].component);
</script>

<template>
  <div class="fixed flex h-full w-full z-50 select-none">
    <!-- left side -->
    <div class="bg-black/20 flex justify-end w-1/3 p-2">
      <div>
        <div v-for="element in elements" :key="element.label">
          <h1 class="ml-2 uppercase text-sm text-white/50 pt-4">
            {{ element.label }}
          </h1>
          <button
            v-if="element.children"
            v-for="child in element.children"
            class="rounded-md w-full hover:text-white p-2 text-left"
            :class="
              selectedLabel == child.label
                ? ' bg-white/8 text-white'
                : 'hover-bg text-white/70'
            "
            @click="
              () => {
                selectedLabel = child.label;
                selectedComp = child.component;
              }
            "
          >
            {{ child.label }}
          </button>
        </div>
      </div>
    </div>
    <!-- middle part -->
    <div class="w-2/5">
      <h1 class="p-8">{{ selectedLabel }}</h1>
      <component class="p-8" :is="selectedComp" />
    </div>
    <!-- right side -->
    <div>
      <button class="" @click="settings.visibility = false">
        <CircleX
          class="m-2 stroke-white/75 hover:stroke-white hover:fill-white/10"
          :size="40"
          :stroke-width="1"
        />
      </button>
    </div>
  </div>
</template>
