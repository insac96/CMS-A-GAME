<template>
  <UiContent title="Power Rank" sub="Xếp hạng lực chiến nhân vật">
    <MainRankPower />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Xếp hạng lực chiến - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.rank.power && useTo().navigateToSSL('/')
check()
</script>