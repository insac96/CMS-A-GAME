<template>
  <div class="LunaPage md:bg-[url(/images/lunanewyear/bg-pc.jpg)] bg-[url(/images/lunanewyear/bg-mobile.png)]">
    <UiFlex class="LunaHeader gap-4" justify="center">
      <UButton variant="link" color="yellow" @click="useTo().navigateToSSL('/main')">Tranh Chủ</UButton>
      <UButton variant="link" color="yellow" @click="toPay">Nạp Tiền</UButton>
      <UButton variant="link" color="yellow" @click="toPlay">Chơi Ngay</UButton>
    </UiFlex>

    <MainLunanewyearLuckymoney class="mb-10" />
    <MainLunanewyearPayment class="mb-20" />
    <MainLunanewyearPaymission class="mb-14" />

    <UModal v-model="modal.payment">
      <div class="p-4">
        <MainActionPayment />
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
    background: #470503
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

  .LunaTitle
    font-family: "UT"

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
</style>