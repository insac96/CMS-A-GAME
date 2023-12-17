<template>
  <UiFlex class="p-3" justify="between">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButtonGroup>
        <UButton icon="i-bx-group" />
        <UButton color="gray">Online</UButton>
        <UButton color="gray" class="px-3">{{onlineTotal}}</UButton>
      </UButtonGroup>
    </UDropdown>
    

    <UiIcon name="i-bx-x" size="5" pointer @click="emit('close')" />
  </UiFlex>
</template>

<script setup>
const socketStore = useSocketStore()
const emit = defineEmits(['close'])

const items = computed(() => [[
  {
    label: 'Khách',
    shortcuts: [socketStore.online.guest],
  },{
    label: 'Thành viên',
    shortcuts: [socketStore.online.member],
  },{
    label: 'Quản trị viên',
    shortcuts: [socketStore.online.admin],
  }
]])

const onlineTotal = computed(() => socketStore.online.guest + socketStore.online.member + socketStore.online.admin)
</script>