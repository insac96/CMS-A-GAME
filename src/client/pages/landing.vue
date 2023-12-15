<template>
  <div class="w-full h-full fixed top-0 left-0">
    <iframe 
      title="Landing Page"
      :src="config.game.landing"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="openSign"></div>

    <UModal v-model="modal">
      <div class="p-2">
        <UTabs v-model="tabItem" :items="tabItems"></UTabs>
        <LazyAuthSignIn v-if="tabItem == 0" @done="start"></LazyAuthSignIn>
        <LazyAuthSignFastUp v-if="tabItem == 1" @done="start"></LazyAuthSignFastUp>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'landing',
})

const { config } = useConfigStore()
const authStore = useAuthStore()
const gameStore = useGameStore()
const modal = ref(false)
const tabItem = ref(1) 
const tabItems = [
  { label: 'Đăng nhập', key: 'in' },
  { label: 'Đăng ký nhanh', key: 'up' }
]

const openSign = () => {
  if(!!authStore.isLogin) return start()
  modal.value = true
}

const start = async () => {
  try {
    const url = await useAPI('game/start')
    modal.value = false
    gameStore.setURL(url)
    navigateTo('/play')
  }
  catch (e) {
    navigateTo('/')
  }
}
</script>