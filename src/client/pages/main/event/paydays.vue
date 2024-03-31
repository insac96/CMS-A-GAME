<template>
  <UiContent title="Pay Days Event" sub="Sự kiện liên nạp">
    <MainEventPaydays />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện liên nạp - ${configStore.config.name}`,
})
</script>