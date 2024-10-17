<template>
  <UiContent title="Dice Lucky" sub="Trò chơi xúc xắc may mắn">
    <MainMinigameDice />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Xúc xắc may mắn - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.minigame.dice && useTo().navigateToSSL('/')
check()
</script>