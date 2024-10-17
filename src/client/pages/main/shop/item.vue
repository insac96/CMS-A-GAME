<template>
  <UiContent title="Item Shop" sub="Cửa hàng vật phẩm trò chơi">
    <MainShopItem />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Cửa hàng vật phẩm - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.shop.item && useTo().navigateToSSL('/')
check()
</script>