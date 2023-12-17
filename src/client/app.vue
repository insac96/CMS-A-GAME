<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="2" />
    <NuxtPage />
    <UNotifications />
    <LazyAuthUpdateUsername v-if="authStore.isLogin && !authStore.profile.username" />
  </NuxtLayout>
</template>

<script setup>
import colors from '#tailwind-config/theme/colors'
const { $socket } = useNuxtApp()
const { imgLink } = useMakeLink()

const appConfig = useAppConfig()

const configStore = useConfigStore()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const primaryCookie = useCookie('theme-primary')
const grayCookie = useCookie('theme-gray')

// Meta Seo
useSeoMeta({
  title: () => configStore.config.name,
  ogTitle: () => configStore.config.name,
  description: () => configStore.config.description,
  ogDescription: () => configStore.config.description,
  ogImage: () => imgLink(configStore.config.og_image),
  ogImageAlt: () => configStore.config.name,
  themeColor: () => colors[appConfig.ui.gray][900],
  ogType: 'website'
})

// Set Theme
if(primaryCookie.value){
  appConfig.ui.primary = primaryCookie.value
}
if(grayCookie.value){
  appConfig.ui.gray = grayCookie.value
}

// Init Socket
onMounted(() => {
  $socket.emit('join-online', !!authStore.isLogin ? authStore.profile._id : null)
  $socket.on('online', data => socketStore.setOnline(data))
  $socket.on('update-online', () => $socket.emit('update-online'))

  $socket.on('page-reload', () => location.reload())
})
</script>