<template>
  <UiContent title="Giftcode" sub="Nhập mã nhận thưởng">
    <MainActionGiftcode />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Giftcode - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.action.giftcode && useTo().navigateToSSL('/')
check()
</script>