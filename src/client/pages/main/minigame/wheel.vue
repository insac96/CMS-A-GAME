<template>
  <UiContent title="Wheel Lucky" sub="Trò chơi vòng quay may mắn">
    <MainMinigameWheel />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Vòng quay may mắn - ${configStore.config.name}`,
})
</script>