<template>
  <UModal v-model="open" prevent-close :ui="{width: 'max-w-[300px]'}">
    <UiFlex type="col" justify="center" class="p-6">
      <UiImg src="/images/icon/newyear.png" w="auto" h="auto" img-w="600" img-h="402" class="w-[70%] my-4 bounce-anim"></UiImg>
      <UiText color="primary" weight="bold" align="center" size="xl" class="mb-1">Tết Nguyên Đán</UiText>
      <UiText color="gray" align="center" class="mb-4">Sự kiện đang diễn ra, đến xem ngay</UiText>

      <UiFlex class="gap-1">
        <UButton @click="run">Đi Đến</UButton>
        <UButton color="gray" @click="open = false">Đóng</UButton>
      </UiFlex>
    </UiFlex>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const open = ref(configStore.config.enable.lunanewyear)

const run = () => {
  useTo().navigateToSSL('/main/lunanewyear')
  open.value = false
}
</script>