<template>
  <UiContent title="Dice Lucky" sub="Trò chơi xúc xắc may mắn" class="max-w-[700px] mx-auto">
    <MainMinigameDice />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Xúc xắc may mắn - ${configStore.config.name}`,
})
</script>