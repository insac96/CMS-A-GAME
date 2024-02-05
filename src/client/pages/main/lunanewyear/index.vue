<template>
  <div class="LunaPage  md:bg-[url(/images/lunanewyear/bg-pc.jpg)] bg-[url(/images/lunanewyear/bg-mobile.png)]">
    <UiFlex class="LunaHeader bg-black/50 backdrop-blur-xl gap-4" justify="center">
      <UButton variant="link" color="yellow" @click="useTo().navigateToSSL('/main')">Trang Chủ</UButton>
      <UButton variant="link" color="yellow" @click="toPay">Nạp Tiền</UButton>
      <UButton variant="link" color="yellow" @click="toPlay">Chơi Ngay</UButton>
    </UiFlex>

    <MainLunanewyearLuckymoney class="mb-16" />
    <MainLunanewyearPayment class="mb-8" />
    <MainLunanewyearPaymission class="mb-16" />
    <MainLunanewyearEgg class="mb-16" />

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

.LunaPage
  position: relative
  width: 100%
  min-height: 100%
  background-repeat: no-repeat
  background-position: top center
  background-color: #f4eee2
  color: #010101
  overflow: hidden
  padding-top: 900px

  .LunaHeader
    width: 100%
    height: 50px
    color: #fcf3d0 !important
    background-size: cover
    position: fixed
    z-index: 20
    top: 0
    left: 0

  .LunaBtn
    position: relative
    background-image: url(/images/lunanewyear/frame-1.png)
    background-position: -221px -108px
    width: 145px
    height: 36px
    cursor: pointer
    &:hover
      filter: brightness(1.2)

  .LunaBtnTitle
    position: relative
    background: url(/images/lunanewyear/btn.png)
    background-position: center center
    background-repeat: no-repeat
    display: inline-flex
    align-items: center
    justify-content: center
    height: 35px
    font-family: "UT"
    color: #000000
    padding: 0 16px
    cursor: pointer
    user-select: none
    border-radius: 20px
    transition: all 0.25s ease
    &:hover
      transform: scale(0.95)
      filter: brightness(1.2)

  .LunaBtnText
    position: relative
    font-family: "UT"
    color: #ffffff
    background-image: url(/images/lunanewyear/frame-1.png)
    background-position: -221px -144px
    width: 145px
    height: 36px
    display: flex
    align-items: center
    justify-content: center

  .LunaPage1
    min-height: 600px
    background-image: url(/images/lunanewyear/bg1.png)
    background-position: top right
    background-repeat: no-repeat
    background-size: auto 600px
    @media only screen and (max-width: 768px)
      background-size: auto 300px

  .LunaPage2
    min-height: 600px
    background-image: url(/images/lunanewyear/bg2.png)
    background-position: top left
    background-repeat: no-repeat
    background-size: auto 350px
    @media only screen and (max-width: 768px)
      background-size: auto 200px

  .LunaTitle
    font-family: "UT"

  .LunaTitle-2
    background-image: url(/images/lunanewyear/frame-3.png)
    background-position: 0px -569px
    width: 340px
    height: 40px
    font-weight: 600
    
  .LunaPayment
    position: relative
    background-image: url(/images/lunanewyear/frame-1.png)
    background-position: 0px 0px
    width: 221px
    height: 233px

  .LunaPayMission
    position: relative
    background-image: url(/images/lunanewyear/frame-2.png)
    background-position: -702px 0px
    width: 351px
    height: 359px

  .LunaEgg
    cursor: pointer
    filter: grayscale(0.2)
    &:hover
      animation: jump 1s ease infinite

  .LunaEggOpen
    filter: grayscale(0.9)
    clip-path: polygon(37% 65%, 30% 51%, 25% 66%, 14% 40%, 9% 100%, 92% 100%, 80% 46%, 75% 55%, 70% 63%, 60% 51%, 52% 63%, 44% 53%)

  .LunaEggFrame
    position: absolute
    background-image: url(/images/lunanewyear/egg-frame.png)
    animation: luna-egg-anim 1.5s steps(1) infinite
    transform: scale(0.5)
    cursor: url('/images/lunanewyear/bua.png'), auto
    @media only screen and (max-width: 768px)
      transform: scale(0.35)

@keyframes luna-egg-anim
  0%
    width: 281px
    height: 356px
    background-position: 848px 357px
  9.09%
    width: 281px
    height: 355px
    background-position: 283px 0
  18.18%
    width: 281px
    height: 352px
    background-position: 565px 0
  27.27%
    width: 281px
    height: 356px
    background-position: 847px 0
  36.36%
    width: 281px
    height: 356px
    background-position: 566px 357px
  45.45%
    width: 282px
    height: 356px
    background-position: 1129px 0
  54.54%
    width: 280px
    height: 354px
    background-position: 0 0
  63.63%
    width: 279px
    height: 356px
    background-position: 1130px 357px
  72.72%
    width: 279px
    height: 354px
    background-position: 1411px 0
  81.81%
    width: 281px
    height: 353px
    background-position: 1411px 357px
  90.9%
    width: 282px
    height: 356px
    background-position: 0 357px
  100%
    width: 282px
    height: 356px
    background-position: 283px 357px
</style>