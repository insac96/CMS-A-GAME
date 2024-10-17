<template>
  <UiContent title="Recharge Shop" sub="Cửa hàng nạp trong game">
    <MainShopRecharge />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Cửa hàng nạp trong game - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.shop.recharge && useTo().navigateToSSL('/')
check()
</script>