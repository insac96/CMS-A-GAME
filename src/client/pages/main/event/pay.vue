<template>
  <UiContent title="Payment Event" sub="Sự kiện tích lũy nạp tiền">
    <MainEventPay />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện tích nạp - ${configStore.config.name}`,
})
</script>