<template>
  <UiContent title="Nạp Xu" sub="Tạo giao dịch mua xu" class="max-w-[700px] mx-auto">
    <MainActionPayment />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nạp xu - ${configStore.config.name}`,
})
</script>