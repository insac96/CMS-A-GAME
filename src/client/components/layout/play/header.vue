<template>
  <header class="w-full bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UiFlex class="w-full h-[50px] max-h-[50px] px-2">
      <div class="md:w-[33%]">
        <LayoutPlayMenu class="mr-2" />
      </div>

      <UiFlex class="md:w-[33%] md:justify-center">
        <UiLogo @click="useTo().navigateToSSL('/')" class="cursor-pointer" />
      </UiFlex>

      <div class="md:w-[33%] ml-auto">
        <UiFlex justify="end" items="center">
          <Setting class="ml-1" />
          <SocketChat class="ml-1" />
          <AuthSlide class="ml-1" />
          <UButton class="ml-1" color="red" icon="i-bx-x" @click="emits('hide')"></UButton>
        </UiFlex>
      </div>
    </UiFlex>
  </header>
</template>

<script setup>
const emits = defineEmits(['hide'])
</script>