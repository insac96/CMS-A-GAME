<template>
  <UiContent title="Spend Event" sub="Sự kiện tích lũy tiêu xu">
    <MainEventSpend />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện tiêu phí - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.event.spend && useTo().navigateToSSL('/')
check()
</script>