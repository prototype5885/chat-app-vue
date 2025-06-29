<script setup lang="ts">
import { ErrorToast } from "@/services/macros";
import { extractDate } from "@/services/snowflakeService";
import type { ContextMenuItem } from "@nuxt/ui";
import axios, { AxiosError } from "axios";

const props = defineProps<{
  messageId: bigint;
  userId: bigint;
  name: string;
  pic: string;
  msg: string;
}>();

const messageCtxMenu: ContextMenuItem[][] = [
  [
    {
      label: "Edit Message",
    },
  ],
  [
    {
      label: "Delete Message",
      color: "error" as const,
      onSelect() {
        console.debug(`Deleting message ID [${props.messageId}]`);
        axios
          .post(
            `/api/message/delete?messageID=${encodeURIComponent(String(props.messageId))}`
          )
          .catch((e: AxiosError) => {
            ErrorToast(e.message);
          });
      },
    },
  ],
  [
    {
      label: "Copy Message ID",
      onSelect() {
        navigator.clipboard.writeText(String(props.messageId));
        useToast().add({ title: `Copied ${props.messageId} to clipboard` });
      },
    },
  ],
];

const userCtxMenu: ContextMenuItem[][] = [
  [
    {
      label: "User",
    },
    {
      label: "Add Friend",
    },
  ],
  [
    {
      label: "Copy User ID",
      onSelect() {
        navigator.clipboard.writeText(String(props.userId));
        useToast().add({ title: `Copied ${props.userId} to clipboard` });
      },
    },
  ],
];

async function pressed() {
  alert(props.messageId);
}
</script>

<template>
  <li>
    <UContextMenu :items="messageCtxMenu">
      <div class="flex flex-row px-3 py-1 hover-bg select-text">
        <!-- avatar -->
        <UContextMenu :items="userCtxMenu">
          <Avatar size="40" :pic="pic" :name="name" :pressed="pressed" />
        </UContextMenu>
        <div class="flex flex-col pl-3">
          <div class="flex flex-row">
            <!-- name -->
            <UContextMenu :items="userCtxMenu">
              <span
                class="font-bold cursor-pointer content-center hover:underline"
              >
                {{ props.userId }}
              </span>
            </UContextMenu>
            <!-- date -->
            <span
              class="ml-2 text-xs text-white/50 content-center cursor-default"
            >
              {{ extractDate(props.messageId, "long") }}
            </span>
          </div>
          <!-- message -->
          <span class="break-all">{{ props.msg }}</span>
        </div>
      </div>
    </UContextMenu>
  </li>
</template>
