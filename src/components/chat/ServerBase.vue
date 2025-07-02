<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  name: string;
  picture?: string;
  selected: boolean;
}>();

const emit = defineEmits(["clicked"]);

function select() {
  emit("clicked");
}
</script>

<template>
  <li>
    <div class="group flex flex-row w-18 h-14 items-center">
      <div
        class="w-1 bg-white rounded-r-full transition-all"
        :class="selected ? 'h-8' : 'h-2 group-hover:h-5'"
      ></div>
      <div class="w-16 flex justify-center" v-tooltip="props.name">
        <button
          class="flex justify-center items-center w-12 h-12 bg-cover bg-center transition-all"
          :style="{
            backgroundImage: props.picture
              ? `url(/cdn/avatars/${props.picture})`
              : '',
          }"
          @click="select"
          :class="
            selected
              ? 'rounded-[35%] bg-blue-500'
              : 'rounded-[50%] group-hover:rounded-[35%] group-hover:bg-blue-500 bg-white/7'
          "
        >
          <slot></slot>
        </button>
      </div>
    </div>
  </li>
</template>
