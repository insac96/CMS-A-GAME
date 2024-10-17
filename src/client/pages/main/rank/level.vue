<template>
  <UiContent title="Level Rank" sub="Xếp hạng cấp độ nhân vật">
    <MainRankLevel />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Xếp hạng cấp độ - ${configStore.config.name}`,
})

const check = () => !configStore.config.menu.rank.level && useTo().navigateToSSL('/')
check()
</script>