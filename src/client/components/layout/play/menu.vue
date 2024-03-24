<template>
  <div>
    <UDropdown :items="menu" :popper="{ placement: 'bottom-start' }">
      <UButton 
        icon="i-bxs-widget"
        color="gray" 
        variant="ghost" 
        aria-label="Theme"
      />
    </UDropdown>

    <UModal v-model="modal.action.payment" preventClose>
      <PlayModal title="Nạp xu" @close="modal.action.payment = false">
        <MainActionPayment />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.action.withdraw" preventClose>
      <PlayModal title="Đổi xu" @close="modal.action.withdraw = false">
        <MainActionWithdraw />
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

    <UModal v-model="modal.shop.currency" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Cửa hàng tiền tệ" @close="modal.shop.currency = false">
        <MainShopCurrency />
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
const configStore = useConfigStore()
const modal = ref({
  action: {
    payment: false,
    withdraw: false,
    giftcode: false,
  },
  shop: {
    pack: false,
    item: false,
    currency: false
  },
  event: {
    login: false,
    pay: false,
    spend: false
  },
  minigame: {
    wheel: false,
    dice: false
  }
})

const show = ref(configStore.config.menu)

const menu = computed(() => {
  const list = []

  // Action
  if(!!show.value.action.payment || !!show.value.action.giftcode){
    const action = []
    if(!!show.value.action.payment) action.push({
      label: 'Nạp xu',
      icon: 'i-bx-credit-card',
      click: () => modal.value.action.payment = true
    })
    if(!!show.value.action.withdraw) action.push({
      label: 'Đổi xu',
      icon: 'i-bx-money-withdraw',
      click: () => modal.value.action.withdraw = true
    })
    if(!!show.value.action.giftcode) action.push({
      label: 'Giftcode',
      icon: 'i-bx-barcode-reader',
      click: () => modal.value.action.giftcode = true
    })
    list.push(action)
  }

  // Shop
  if(!!show.value.shop.item || !!show.value.shop.currency){
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
    if(!!show.value.shop.currency) shop.push({
      label: 'CH Tiền tệ',
      icon: 'i-bx-money',
      click: () => modal.value.shop.currency = true
    })
    list.push(shop)
  }

  // Event
  if(!!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend){
    const event = []
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