<template>
  <UCard 
    class="flex flex-col flex-1 max-h-full h-full" 
    :ui="{ 
      body: { base: 'flex grow overflow-hidden', padding: '' },
      header: { padding: '' },
      footer: { padding: '' },
      ring: '', 
      divide: 'divide-y divide-gray-100 dark:divide-gray-800'
    }"
  >
    <template #header>
      <SocketOnline @close="emits('close')" :hidden-x="hiddenX" />
    </template>

    <SocketChatList />

    <template #footer>
      <SocketChatSend />
    </template>
  </UCard>
</template>

<script setup>
const props = defineProps(['hiddenX'])
const emits = defineEmits(['close'])
</script>