<template>
  <header class="sticky top-0 z-50 bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UContainer class="flex items-center h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutDefaultNavSlide class="lg:w-auto"/>
      
      <UiFlex class="justify-center lg:mx-4 mx-2 lg:w-auto">
        <NuxtLink to="/">
          <UiLogo />
        </NuxtLink>
      </UiFlex>

      <LayoutDefaultHeaderMenu class="grow lg:flex hidden" />
      
      <UiFlex justify="end" items="center" class="ml-auto lg:w-auto">
        <Setting />
        <SocketChat class="ml-1" />
        <AuthSign v-if="!authStore.isLogin" class="ml-1" />
        <LazyAuthSlide v-else class="ml-1" />
      </UiFlex>
    </UContainer>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>