<template>
  <UiContent title="Login Event" sub="Sự kiện tích lũy đăng nhập">
    <MainEventLogin />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự kiện đăng nhập - ${configStore.config.name}`,
})
</script>