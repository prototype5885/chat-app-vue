<script setup lang="ts">
const props = defineProps({
  channel: String,
});
</script>

<template>
  <div class="flex flex-row h-screen grow">
    <div class="flex flex-col min-w-60 max-w-60">
      <Suspense>
        <ChannelList class="bg-black/20" />
        <template #fallback>
          <div class="bg-black/20 flex grow">Loading channels</div>
        </template>
      </Suspense>

      <UserPanel />
    </div>

    <RouterView :key="props.channel" />
  </div>
</template>
