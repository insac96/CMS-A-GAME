<template>
  <UiFlex type="col" class="relative w-full h-full min-w-full overflow-hidden">
    <LayoutPlayHeader v-if="!!showHeader" @hide="showHeader = false" />

    <LayoutPlayDrag v-show="!showHeader" @open="showHeader = true" @startdrag="showOverflow = true" @enddrag="showOverflow = false"/>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!showOverflow"></div>

    <UiFlex justify="center" class="grow w-full overflow-hidden">
      <slot></slot>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
useSeoMeta({
  title: () => `Playing Game`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))

const showHeader = ref(false)
const showOverflow = ref(false)
</script>