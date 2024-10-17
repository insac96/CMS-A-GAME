<template>
  <UiFlex>
    <UButton
      class="relative p-1.5"
      icon="i-bxs-chat"
      color="gray"
      aria-label="Chat"
      @click="open = true"
    >
    </UButton>

    <USlideover v-model="open" :ui="{ width: 'w-screen md:max-w-sm max-w-xs'}">
      <SocketChat />
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>