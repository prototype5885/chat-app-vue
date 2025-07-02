<script setup lang="ts">
import { extractDate } from "@/services/snowflakeService";
import Avatar from "@/components/Avatar.vue";

const props = defineProps<{
  messageId: bigint;
  userId: bigint;
  name: string;
  pic: string;
  msg: string;
}>();

async function pressed() {
  alert(props.messageId);
}
</script>

<template>
  <li>
    <!-- <ContextMenu :model="messageCtxMenu"> -->
    <div class="flex flex-row px-3 py-1 hover-bg select-text">
      <!-- avatar -->
      <!-- <ContextMenu :model="userCtxMenu"> -->
      <Avatar size="40" :pic="pic" :name="name" :pressed="pressed" />
      <!-- </ContextMenu> -->
      <div class="flex flex-col pl-3">
        <div class="flex flex-row">
          <!-- name -->
          <!-- <ContextMenu :model="userCtxMenu"> -->
          <span class="font-bold cursor-pointer content-center hover:underline">
            {{ props.userId }}
          </span>
          <!-- </ContextMenu> -->
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
    <!-- </ContextMenu> -->
  </li>
</template>
