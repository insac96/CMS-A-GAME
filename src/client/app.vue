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
const runtimeConfig = useRuntimeConfig()
const { imgLink } = useMakeLink()

const appConfig = useAppConfig()

const configStore = useConfigStore()
const authStore = useAuthStore()

const primaryCookie = useCookie('theme-primary')
const grayCookie = useCookie('theme-gray')


// Meta Seo
useHead({
  title: configStore.config.name,
  meta: [
    { name: 'og:title', property: 'og:title', hid: 'og:title', content: configStore.config.name },
    { name: 'description', property: 'description', hid: 'description', content: configStore.config.description },
    { name: 'og:description', property: 'og:description', hid: 'og:description', content: configStore.config.description },
    { name: 'og:image', property: 'og:image', hid: 'og:image', content: imgLink(configStore.config.og_image) },
    { name: 'og:image:alt', property: 'og:image:alt', hid: 'og:image:alt', content: configStore.config.description },
    { name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website' },
  ],
})

useSeoMeta({
  themeColor: colors[appConfig.ui.gray][900],
})

// Set Theme
if(primaryCookie.value){
  appConfig.ui.primary = primaryCookie.value
}
if(grayCookie.value){
  appConfig.ui.gray = grayCookie.value
}
</script>