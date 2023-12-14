<template>
  <UiFlex class="p-3" justify="between">
    <UButtonGroup>
      <UButton icon="i-bx-group" />
      <UButton color="gray">{{socketStore.online}}</UButton>
    </UButtonGroup>

    <UiIcon name="i-bx-x" size="5" pointer @click="emit('close')" />
  </UiFlex>
</template>

<script setup>
const socketStore = useSocketStore()
const emit = defineEmits(['close'])
</script>