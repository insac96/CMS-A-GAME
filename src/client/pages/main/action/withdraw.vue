<template>
  <UiContent title="Withdraw" sub="Tạo giao dịch rút tiền" class="max-w-[700px] mx-auto">
    <MainActionWithdraw />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Rút tiền - ${configStore.config.name}`,
})
</script>