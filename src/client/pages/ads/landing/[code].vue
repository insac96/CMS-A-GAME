<template>
  <div class="w-full h-full fixed top-0 left-0" v-if="!!landing">
    <iframe 
      title="Landing Page"
      :src="landing.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="openSign"></div>

    <UModal v-model="modal">
      <LazyAuthSignFastUp @done="thankyou" :landing="landing._id"></LazyAuthSignFastUp>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'landing',
})

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()
const modal = ref(false)
const landing = ref(undefined)

const openSign = () => {
  if(!!authStore.isLogin) return start()
  modal.value = true
}

const thankyou = async () => {
  useTo().navigateToSSL('/ads/thankyou')
}

const start = async () => {
  try {
    await useAPI('game/start')

    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}

const getLanding = async () => {
  try {
    const data = await useAPI('ads/landing/code', { code: route.params.code })
    landing.value = data

    // Add Cookie Ads Landing
    const fromCookie = useCookie('ads-landing', runtimeConfig.public.cookieConfig)
    fromCookie.value = data
  }
  catch (e) {
    return false
  }
}
getLanding()
</script>