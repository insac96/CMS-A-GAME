<template>
  <header class="w-full bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UiFlex class="w-full h-[50px] max-h-[50px] px-2">
      <LayoutPlayMenu class="mr-2" />

      <UiFlex class="mr-auto">
        <!-- <NuxtLink to="/">
          <UiLogo />
        </NuxtLink> -->
        <UButton size="xs" color="gray" @click="navigateTo('/')">Trang chủ</UButton>
      </UiFlex>

      <UiFlex justify="end" items="center">
        <Setting class="ml-1" />
        <SocketChat class="ml-1" />
        <AuthSlide class="ml-1" />
        <UButton class="ml-1" color="red" icon="i-bx-x" @click="emits('hide')"></UButton>
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const emits = defineEmits(['hide'])
</script>