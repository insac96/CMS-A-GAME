<template>
  <header class="
    sticky top-0 z-50 
    bg-gray-800
    px-4
  ">
    <UContainer class="p-0 sm:p-0">
      <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)] gap-4">
        <UiFlex class="justify-center">
          <NuxtLink to="/">
            <UiLogo />
          </NuxtLink>
        </UiFlex>

        <LayoutDefaultHeaderMenu class="grow lg:flex hidden" />
        
        <UiFlex justify="end" items="center" class="ml-auto gap-1">
          <DataSupport />
          <SocketChatSlide />
          <AuthSign v-if="!authStore.isLogin" />
          <LazyAuthSlide v-else />
          <PlayBtn size="sm"></PlayBtn>
        </UiFlex>
      </UiFlex>
    </UContainer>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>