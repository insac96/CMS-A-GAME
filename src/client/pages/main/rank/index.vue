<template>
  <UiContent title="Rank" sub="Bảng Xếp Hạng" icon="bxs-bar-chart-alt-2">
    <UTabs v-model="tab" :items="items" class="w-full" v-if="items.length > 1" />

    <MainRankLevel v-if="select === 'level'" />
    <MainRankPower v-if="select === 'power'" />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Xếp Hạng - ${configStore.config.name}`,
})

const tab = ref(0)
const show = ref(configStore.config.menu.rank)
const items = computed(() => {
  const list =  []

  if(!!show.value.level){
    list.push({ label: 'Cấp Độ', type: 'level' })
  }
  if(!!show.value.power){
    list.push({ label: 'Lực Chiến', type: 'power' })
  }

  return list
})
const select = computed(() => items.value[tab.value].type)
</script>