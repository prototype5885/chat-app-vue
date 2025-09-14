<script setup lang="ts">
import { extractDate } from "@/services/snowflakeService";
import Avatar from "@/components/Avatar.vue";

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
  <li class="ctx-menu" ctx-type="message" :msg-id="messageId">
    <div class="flex flex-row px-3 py-1 hover-bg select-text">
      <!-- avatar -->
      <Avatar
        size="40"
        :pic="pic"
        :name="name"
        :pressed="pressed"
        class="ctx-menu"
        ctx-type="user"
        :user-id="userId"
      />
      <div class="flex flex-col pl-3">
        <div class="flex flex-row">
          <!-- name -->
          <span
            class="ctx-menu font-bold cursor-pointer content-center hover:underline"
            ctx-type="user"
            :user-id="userId"
          >
            {{ props.name }}
          </span>
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
  </li>
</template>
