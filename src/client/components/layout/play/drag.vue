<template>
  <div>
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="menu" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true'
      }">
        <UiImg v-if="!!configStore.config.logo_image" :src="configStore.config.logo_image" w="1" h="1" img-w="100" img-h="100" class="w-full h-full rounded-full" />
        <UiIcon v-else name="i-bx-menu" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging"></div>

    <UModal v-model="modal.admin.user" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Tài khoản" @close="modal.admin.user = false">
        <AdminUserInfo v-if="!!playCookie && !!playCookie.user" :user="playCookie.user" />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.admin.mail" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Gửi vật phẩm" @close="modal.admin.mail = false">
        <AdminGameSend v-if="!!playCookie && !!playCookie.user" :user="playCookie.user" :role="playCookie.role || null" :server="playCookie.server || null" @close="modal.admin.mail = false" />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.action.payment" preventClose>
      <PlayModal title="Nạp xu" @close="modal.action.payment = false">
        <MainActionPayment />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.action.giftcode" preventClose>
      <PlayModal title="Giftcode" @close="modal.action.giftcode = false">
        <MainActionGiftcode />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.shop.pack" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Cửa hàng gói" @close="modal.shop.pack = false">
        <MainShopPack />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.shop.item" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Cửa hàng vật phẩm" @close="modal.shop.item = false">
        <MainShopItem />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.referral" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện mời bạn" @close="modal.event.referral = false">
        <MainEventReferral />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.login" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện đăng nhập" @close="modal.event.login = false">
        <MainEventLogin />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.pay" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện tích nạp" @close="modal.event.pay = false">
        <MainEventPay />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.spend" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện tiêu phí" @close="modal.event.spend = false">
        <MainEventSpend />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.paymusty" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện nạp đơn" @close="modal.event.paymusty = false">
        <MainEventPaymusty />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event.paydays" preventClose :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Sự kiện liên nạp" @close="modal.event.paydays = false">
        <MainEventPaydays />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.minigame.wheel" preventClose :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Vòng quay may mắn" @close="modal.minigame.wheel = false">
        <MainMinigameWheel :history="false" />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.minigame.dice" preventClose :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Xúc xắc may mắn" @close="modal.minigame.dice = false">
        <MainMinigameDice :history="false" />
      </PlayModal>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps(['admin'])
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const show = ref(configStore.config.menu)

const el = ref(null)
const dragging = ref(false)

const playCookie = useCookie('play-admin-url', runtimeConfig.public.cookieConfig)

const modal = ref({
  admin: {
    user: false,
    mail: false
  },
  action: {
    payment: false,
    giftcode: false,
  },
  shop: {
    pack: false,
    item: false,
    currency: false
  },
  event: {
    referral: false,
    login: false,
    pay: false,
    spend: false,
    paymusty: false,
    paydays: false
  },
  minigame: {
    wheel: false,
    dice: false
  }
})

const { style } = useDraggable(el, {
  initialValue: { x: -8, y: -8 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const menu = computed(() => {
  const list = [
    [{
      label: 'Trang chủ',
      icon: 'i-bx-home',
      click: () => useTo().navigateToSSL('/')
    }]
  ]

  // Admin
  if(authStore.profile.type > 1){
    const admin = [{
      label: 'Quản trị viên',
      icon: 'i-bx-shield',
      click: () => useTo().navigateToSSL('/admin')
    }]

    if(!!props.admin){
      admin.push({
        label: 'Tài khoản',
        icon: 'i-bx-user',
        click: () => modal.value.admin.user = true
      })
      admin.push({
        label: 'Gửi vật phẩm',
        icon: 'i-bx-envelope',
        click: () => modal.value.admin.mail = true
      })
    }

    list.push(admin)
  }

  // Action
  if(!!show.value.action.payment || !!show.value.action.giftcode){
    const action = []
    if(!!show.value.action.payment) action.push({
      label: 'Nạp xu',
      icon: 'i-bx-credit-card',
      click: () => modal.value.action.payment = true
    })
    if(!!show.value.action.giftcode) action.push({
      label: 'Giftcode',
      icon: 'i-bx-barcode-reader',
      click: () => modal.value.action.giftcode = true
    })
    list.push(action)
  }

  // Shop
  if(!!show.value.shop.item || !!show.value.shop.pack){
    const shop = []
    if(!!show.value.shop.pack) shop.push({
      label: 'CH Gói',
      icon: 'i-bx-package',
      click: () => modal.value.shop.pack = true
    })
    if(!!show.value.shop.item) shop.push({
      label: 'CH Vật phẩm',
      icon: 'i-bx-shopping-bag',
      click: () => modal.value.shop.item = true
    })
    list.push(shop)
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    const event = []
    if(!!show.value.event.referral) event.push({
      label: 'SK Mời bạn',
      icon: 'i-bx-user-plus',
      click: () => modal.value.event.referral = true
    })
    if(!!show.value.event.login) event.push({
      label: 'SK Đăng nhập',
      icon: 'i-bx-calendar',
      click: () => modal.value.event.login = true
    })
    if(!!show.value.event.pay) event.push({
      label: 'SK Tích nạp',
      icon: 'i-bx-credit-card-alt',
      click: () => modal.value.event.pay = true
    })
    if(!!show.value.event.spend) event.push({
      label: 'SK Tiêu phí',
      icon: 'i-bx-wallet-alt',
      click: () => modal.value.event.spend = true
    })
    if(!!show.value.event.paymusty) event.push({
      label: 'SK Đơn nạp',
      icon: 'i-bx-wallet',
      click: () => modal.value.event.paymusty = true
    })
    if(!!show.value.event.paydays) event.push({
      label: 'SK Liên nạp',
      icon: 'i-bx-timer',
      click: () => modal.value.event.paydays = true
    })
    list.push(event)
  }

  // Minigame
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    const minigame = []
    if(!!show.value.minigame.wheel) minigame.push({
      label: 'Vòng quay',
      icon: 'i-bxs-color',
      click: () => modal.value.minigame.wheel = true
    })
    if(!!show.value.minigame.dice) minigame.push({
      label: 'Xúc xắc',
      icon: 'i-bx-dice-6',
      click: () => modal.value.minigame.dice = true
    })
    list.push(minigame)
  }

  if(!!show.value.social.facebook || !!show.value.social.group){
    const social = []

    if(!!show.value.social.facebook) social.push({
      label: 'Fanpage',
      icon: 'i-bxl-facebook',
      click: () => window.open(configStore.config.social.facebook, '_blank')
    })
    if(!!show.value.social.group) social.push({
      label: 'Group',
      icon: 'i-bxs-group',
      click: () => window.open(configStore.config.social.zalo, '_blank')
    })

    list.push(social)
  }

  return list
})
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 100
  cursor: pointer
</style>