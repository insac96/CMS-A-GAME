<template>
  <header class="
    sticky top-0 
    z-50 
    bg-white/75 dark:bg-gray-900 
    backdrop-blur-xl
    border-b border-gray-100 dark:border-gray-800
    px-4
  ">
    <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)] gap-4">
      <LayoutDefaultNavSlide class="flex 2xl:hidden"/>
      
      <UiFlex class="justify-center">
        <NuxtLink to="/">
          <UiLogo />
        </NuxtLink>
      </UiFlex>

      <!-- <LayoutDefaultHeaderMenu class="grow lg:flex hidden" /> -->
      
      <UiFlex justify="end" items="center" class="ml-auto gap-1">
        <Setting />

        <SocketChatSlide class="flex 2xl:hidden" />

        <AuthSign v-if="!authStore.isLogin" />
        <LazyAuthSlide v-else />
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>