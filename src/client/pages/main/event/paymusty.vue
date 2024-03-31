<template>
  <UiContent title="Pay Musty Event" sub="Sự kiện nạp đơn ngày">
    <MainEventPaymusty />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện nạp đơn ngày - ${configStore.config.name}`,
})
</script>