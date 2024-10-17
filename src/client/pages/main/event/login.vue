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

const check = () => !configStore.config.menu.event.login && useTo().navigateToSSL('/')
check()
</script>