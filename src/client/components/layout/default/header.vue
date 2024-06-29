<template>
  <header class="sticky top-0 z-50 bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UContainer class="flex justify-between items-center h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutDefaultNavSlide class="w-1/3"/>
      
      <UiFlex class="w-1/3 justify-center">
        <NuxtLink to="/">
          <UiLogo />
        </NuxtLink>
      </UiFlex>
      
      <UiFlex justify="end" items="center" class="w-1/3">
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