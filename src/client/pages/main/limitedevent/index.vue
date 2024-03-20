<template>
  <div class="LimitedEventPage">
    <div class="LimitedEventPage__Top">
      <img src="/images/limitedevent/bg.jpeg">
      <img src="/images/limitedevent/bg-top.png">
    </div>

    <UiFlex class="mb-16" justify="center">
      <UiFlex class="LimitedEventPage__Btn lg:w-[170px] lg:h-[43px] w-[25vw] h-[7vw] md:text-xl text-sm" justify="center" @click="useTo().navigateToSSL('/')">Trang Chủ</UiFlex>
      <UiFlex class="LimitedEventPage__Btn lg:w-[170px] lg:h-[43px] w-[25vw] h-[7vw] md:text-xl text-sm" justify="center" @click="toPay()">Nạp Tiền</UiFlex>
      <UiFlex class="LimitedEventPage__Btn lg:w-[170px] lg:h-[43px] w-[25vw] h-[7vw] md:text-xl text-sm" justify="center" @click="toPlay()">Chơi Ngay</UiFlex>
    </UiFlex>

    <MainLimitedeventLuckymoney/>
    <MainLimitedeventPayment/>
    <MainLimitedeventPaymission />
    <MainLimitedeventEgg />

    <UModal v-model="modal.payment">
      <div class="p-4">
        <MainActionPayment />
      </div>
    </UModal>

    <UModal v-model="modal.sign">
      <div class="p-2">
        <UTabs v-model="tabItem" :items="tabItems"></UTabs>
        <LazyAuthSignIn v-if="tabItem == 0" @done="modal.sign = false"></LazyAuthSignIn>
        <LazyAuthSignUp v-if="tabItem == 1" @done="modal.sign = false"></LazyAuthSignUp>
        <LazyAuthSignForgot v-if="tabItem == 2" @done="modal.sign = false"></LazyAuthSignForgot>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()

const modal = ref({
  sign: false,
  payment: false
})

const tabItem = ref(0) 
const tabItems = [
  { label: 'Đăng nhập', key: 'in' },
  { label: 'Đăng ký', key: 'up' },
  { label: 'Mật khẩu', key: 'fotgot' },
]
watch(() => authStore.modal, (val) => !!val && (modal.value.sign = true))
watch(() => modal.value.sign, (val) => !val && authStore.setModal(false))

const toPay = () => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value.payment = true
}

const toPlay = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    await useAPI('game/start')
    if(!!runtimeConfig.public.dev) navigateTo('play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    return false
  }
}
</script>