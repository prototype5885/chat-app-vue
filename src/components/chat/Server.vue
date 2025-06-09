<script setup lang="ts">
import type { ServerModel } from "@/models";
import { Mail, Plus } from "lucide-vue-next";
import { defineProps, ref } from "vue";
import type { ContextMenuItem } from "@nuxt/ui";

const items = ref<ContextMenuItem[][]>([
  [
    {
      label: "Rename server",
    },
  ],
  [
    {
      label: "Show Sidebar",
      kbds: ["meta", "s"],
    },
  ],
  [
    {
      label: "Delete server",
      color: "error" as const,
    },
  ],
]);

const props = defineProps<{
  server: ServerModel;
  selected: boolean;
}>();

const emit = defineEmits(["select-server"]);

function select() {
  emit("select-server");
}
</script>

<template>
  <li>
    <div class="group flex flex-row w-18 h-14 items-center">
      <div
        class="w-1 bg-white rounded-r-full transition-all"
        :class="selected ? 'h-8' : 'h-2 group-hover:h-5'"
      ></div>
      <div class="w-16 flex justify-center">
        <UContextMenu :items="items" :ui="{ content: 'w-48' }">
          <div>
            <UPopover mode="hover" arrow :content="{ side: 'right' }">
              <button
                class="flex justify-center items-center w-12 h-12 bg-cover bg-center transition-all"
                :style="{
                  backgroundImage: `url(/avatars/${props.server.picture})`,
                }"
                @click="select"
                :class="
                  selected
                    ? 'rounded-[35%] bg-blue-500'
                    : 'rounded-[50%] group-hover:rounded-[35%] group-hover:bg-blue-500 bg-white/7'
                "
              >
                <Mail
                  v-if="props.server.id === 'dm'"
                  :size="32"
                  :strokeWidth="1"
                />
                <Plus v-else-if="props.server.id === 'add-server'" />
                <span
                  v-else-if="
                    props.server.picture == undefined ||
                    props.server.picture == ''
                  "
                  >{{ props.server.name[0].toUpperCase() }}</span
                >
              </button>

              <template #content>
                {{ props.server.name }}
              </template>
            </UPopover>
          </div>
        </UContextMenu>
      </div>
    </div>
  </li>
</template>
