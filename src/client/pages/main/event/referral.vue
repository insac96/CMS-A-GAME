<template>
  <UiContent title="Referral Event" sub="Sự kiện mời bạn cùng chơi">
    <MainEventReferral />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện mời bạn cùng chơi - ${configStore.config.name}`,
})
</script>