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

<style lang="sass">
@font-face
  font-family: "UT"
  src: url(/fonts/UT.woff2)

.LimitedEventPage
  position: relative
  width: 100%
  min-height: 100%
  background-color: #fee7eb
  color: #660621
  font-family: UT
  &__Top
    height: 45vw
    max-height: 45vw
    overflow: hidden
    position: relative
    &::before, &::after
      border: none
    img
      position: absolute
      &::before, &::after
        border: none
      &:first-child
        width: 100%
        object-fit: cover
      &:last-child
        width: 120%
        bottom: 0

  &__Title
    position: relative
    margin-bottom: 2rem
    &__Text
      position: absolute
      text-align: center
      bottom: 1rem

  &__Title-2
    background: url(/images/limitedevent/title-2.png) no-repeat top center / 100%
    width: 200px
    height: 37px
    text-align: center
    color: #fff

  &__Btn
    background: url(/images/limitedevent/btn.png) no-repeat top center / 100%
    cursor: pointer
</style>