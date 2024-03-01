<template>
  <UiContent title="Withdraw" sub="Tạo giao dịch đổi xu" class="max-w-[700px] mx-auto">
    <MainActionWithdraw />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Đổi xu - ${configStore.config.name}`,
})
</script>