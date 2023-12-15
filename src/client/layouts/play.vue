<template>
  <UiFlex type="col" class="relative w-full h-full min-w-full overflow-hidden">
    <LayoutPlayHeader />

    <!-- <LayoutPlayTest /> -->

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
</script>