<template>
  <UiContent title="Currency Shop" sub="Cửa hàng tiền tệ trang web">
    <MainShopCurrency />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Cửa hàng tiền tệ - ${configStore.config.name}`,
})
</script>