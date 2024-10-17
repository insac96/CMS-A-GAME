<template>
  <UiContent title="Pay Musty Event" sub="Nạp đúng số tiền chỉ định để nhận thưởng">
    <MainEventPaymusty />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện nạp đơn ngày - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.event.paymusty && useTo().navigateToSSL('/')
check()
</script>