<template>
  <UiFlex>
    <UButton color="gray" aria-label="Sign" @click="modal = true">
      Đăng Nhập
    </UButton>

    <UModal v-model="modal">
      <div class="p-2">
        <UTabs v-model="tabItem" :items="tabItems"></UTabs>
        <LazyAuthSignIn v-if="tabItem == 0" @done="modal = false"></LazyAuthSignIn>
        <LazyAuthSignUp v-if="tabItem == 1" @done="modal = false"></LazyAuthSignUp>
        <LazyAuthSignForgot v-if="tabItem == 2" @done="modal = false"></LazyAuthSignForgot>
      </div>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)
const tabItem = ref(0) 
const tabItems = [
  { label: 'Đăng nhập', key: 'in' },
  { label: 'Đăng ký', key: 'up' },
  { label: 'Mật khẩu', key: 'fotgot' },
]

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))
</script>