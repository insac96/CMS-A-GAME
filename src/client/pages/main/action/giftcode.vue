<template>
  <UiContent title="Giftcode" sub="Nhập mã nhận thưởng" class="max-w-[600px] mx-auto" >
    <MainActionGiftcode />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Giftcode - ${configStore.config.name}`,
})
</script>