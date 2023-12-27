<template>
  <UButton :block="block" icon="i-bx-play" :size="size || 'md'" :loading="loading" @click="start">{{ text || 'Chơi Ngay' }}</UButton>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const props = defineProps(['block', 'text', 'size'])
const loading = ref(false)
const authStore = useAuthStore()
const gameStore = useGameStore()

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    loading.value = true
    const url = await useAPI('game/start')

    const playCookie = useCookie('play-url', runtimeConfig.cookieConfig)
    playCookie.value = url
    gameStore.setURL(url)

    if(document.location.protocol == 'https:') {
      navigateTo(`http://play.${runtimeConfig.public.domain}/play`)
    }
    else {
      navigateTo('/play')
    }
    
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>