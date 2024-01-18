<template>
  <UiContent title="Pack Shop" sub="Cửa hàng gói vật phẩm">
    <MainShopPack />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Cửa hàng gói - ${configStore.config.name}`,
})
</script>