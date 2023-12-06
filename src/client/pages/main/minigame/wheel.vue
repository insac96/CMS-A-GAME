<template>
  <UiContent title="Wheel Lucky" sub="Trò chơi vòng quay may mắn" class="max-w-[700px] mx-auto">
    <MainMinigameWheel />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Vòng quay may mắn - ${configStore.config.name}`,
})
</script>