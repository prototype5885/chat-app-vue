<script setup lang="ts">
import { extractDate } from "@/services/snowflakeService";

const props = defineProps<{
  messageId: string;
  userId: string;
  name: string;
  pic: string;
  msg: string;
}>();

async function pressed() {
  alert(props.messageId);
}
</script>

<template>
  <li class="flex flex-row px-3 py-1 hover-bg select-text">
    <Avatar size="10" :pic="pic" :name="name" :pressed="pressed" />
    <div class="flex flex-col pl-3">
      <div class="flex flex-row">
        <!-- name -->
        <span class="font-bold cursor-pointer content-center hover:underline">
          {{ props.userId }}
        </span>
        <!-- date -->
        <span class="ml-2 text-xs text-white/50 content-center">
          {{ extractDate(props.messageId, "long") }}
        </span>
      </div>
      <!-- message -->
      <span class="break-all">{{ props.msg }}</span>
    </div>
  </li>
</template>
