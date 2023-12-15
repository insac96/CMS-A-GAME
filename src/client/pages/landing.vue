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
        <LazyAuthSignUp v-if="tabItem == 1" @done="start"></LazyAuthSignUp>
        <LazyAuthSignForgot v-if="tabItem == 2" @done="start"></LazyAuthSignForgot>
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
const tabItem = ref(0) 
const tabItems = [
  { label: 'Đăng nhập', key: 'in' },
  { label: 'Đăng ký', key: 'up' },
  { label: 'Mật khẩu', key: 'fotgot' },
]

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))

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
    navigateTo('/main')
  }
}
</script>