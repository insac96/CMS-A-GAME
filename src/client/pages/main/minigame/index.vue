<template>
  <UiContent title="Mini Game" sub="Các trò chơi nhỏ khác" icon="bxs-game">
    <UTabs v-model="tab" :items="items" class="w-full" v-if="items.length > 1" />

    <MainMinigameWheel v-if="select === 'wheel'" />
    <MainMinigameDice v-if="select === 'dice'" />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `MiniGame - ${configStore.config.name}`,
})

const tab = ref(0)
const show = ref(configStore.config.menu.minigame)
const items = computed(() => {
  const list =  []

  if(!!show.value.wheel){
    list.push({ label: 'Vòng Quay May Mắn', type: 'wheel' })
  }
  if(!!show.value.dice){
    list.push({ label: 'Xúc Xắc', type: 'dice' })
  }

  return list
})
const select = computed(() => items.value[tab.value].type)
</script>