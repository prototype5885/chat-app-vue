<script setup lang="ts">
import Actions from "@/services/httpActions";
import { onMounted, onUnmounted, ref } from "vue";
import Separator from "./Separator.vue";
import { useToast } from "vue-toast-notification";

interface CtxMenuItemBase {
  type: "item" | "separator";
}

interface CtxMenuItemItem extends CtxMenuItemBase {
  type: "item";
  label: string;
  color: "default" | "red";
  action: () => void;
}

interface CtxMenuItemSeparator extends CtxMenuItemBase {
  type: "separator";
}

type CtxMenuItem = CtxMenuItemItem | CtxMenuItemSeparator;

interface Position {
  x: number;
  y: number;
}

const menuItems = ref<CtxMenuItem[]>();

const visible = ref<boolean>(false);
const position = ref<Position>({ x: 0, y: 0 });
const ctxMenu = ref<HTMLElement | null>(null);

function showContextMenu(event: MouseEvent): void {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const element: HTMLElement | null = target?.closest(".ctx-menu") ?? null;
  const type: string = element?.getAttribute("ctx-type") ?? "";

  switch (type) {
    case "message":
      const messageID: bigint = BigInt(element?.getAttribute("msg-id") ?? 0n);
      if (messageID === 0n) {
        useToast().error("Message has no ID");
        visible.value = false;
        return;
      }

      const messageItems: CtxMenuItem[] = [
        {
          type: "item",
          label: "Edit message",
          color: "default",
          action: () => {},
        },
        {
          type: "item",
          label: "Delete message",
          color: "red",
          action: () => {},
        },
      ];

      menuItems.value = messageItems;
      break;
    case "user":
      const userID: bigint = BigInt(element?.getAttribute("user-id") ?? 0n);
      if (userID === 0n) {
        useToast().error("User has no ID");
        visible.value = false;
        return;
      }

      const userItems: CtxMenuItem[] = [
        { type: "item", label: "Add user", color: "default", action: () => {} },
        { type: "separator" },
        { type: "item", label: "Remove user", color: "red", action: () => {} },
        { type: "item", label: "Block User", color: "red", action: () => {} },
        { type: "separator" },
        {
          type: "item",
          label: "Copy user ID",
          color: "default",
          action: () => {
            navigator.clipboard.writeText(userID.toString());
            useToast().info(`Copied user ID ${userID} to clipboard`);
          },
        },
      ];

      menuItems.value = userItems;
      break;
    case "server":
      const serverID: bigint = BigInt(element?.getAttribute("server-id") ?? 0n);
      if (serverID === 0n) {
        useToast().error("Server has no ID");
        visible.value = false;
        return;
      }

      const serverItems: CtxMenuItem[] = [
        {
          type: "item",
          label: "Edit server",
          color: "default",
          action: async () => {
            await Actions.RenameServer(serverID);
          },
        },
        {
          type: "item",
          label: "Delete server",
          color: "red",
          action: async () => {
            await Actions.DeleteServer(serverID);
          },
        },
      ];

      menuItems.value = serverItems;
      break;
    default: // if something was clicked that doesn't have ctx menu
      visible.value = false;
      return;
  }

  position.value = {
    x: event.clientX,
    y: event.clientY,
  };
  visible.value = true;
}

const closeContextMenu = (event: MouseEvent) => {
  if (ctxMenu.value && !ctxMenu.value.contains(event.target as Node)) {
    visible.value = false;
    menuItems.value = undefined;
  }
};

onMounted((): void => {
  document.addEventListener("contextmenu", showContextMenu);
  document.addEventListener("click", closeContextMenu);
});

onUnmounted((): void => {
  document.removeEventListener("contextmenu", showContextMenu);
  document.removeEventListener("click", closeContextMenu);
});
</script>

<template>
  <div
    v-if="visible"
    ref="ctxMenu"
    class="fixed z-50 min-w-36 shadow-lg/35 bg-black/50 shadow-black border border-white/10 p-2 backdrop-blur-sm"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @click.stop
  >
    <ul class="m-0 p-0 list-none">
      <template v-for="(item, index) in menuItems">
        <li
          v-if="item.type === 'item'"
          class="px-2 py-2 text-sm cursor-pointer"
          :class="
            item.color == 'red'
              ? 'text-red-500 hover:bg-red-500 hover:text-white'
              : 'text-white hover:bg-blue-500'
          "
          :key="index"
          @click="
            () => {
              item.action();
              visible = false;
            }
          "
        >
          {{ item.label }}
        </li>
        <Separator v-else-if="item.type === 'separator'" />
      </template>
    </ul>
  </div>
</template>
