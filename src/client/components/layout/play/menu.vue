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

    <UModal v-model="modal.payment" preventClose>
      <PlayModal title="Nạp xu" @close="modal.payment = false">
        <MainActionPayment />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.giftcode" preventClose>
      <PlayModal title="Giftcode" @close="modal.giftcode = false">
        <MainActionGiftcode />
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

    <UModal v-model="modal.wheel" preventClose :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Vòng quay may mắn" @close="modal.wheel = false">
        <MainMinigameWheel :history="false" />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.dice" preventClose :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Xúc xắc may mắn" @close="modal.dice = false">
        <MainMinigameDice :history="false" />
      </PlayModal>
    </UModal>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref({
  payment: false,
  giftcode: false,
  shop: {
    item: false,
    currency: false
  },
  event: {
    login: false,
    pay: false,
    spend: false
  },
  wheel: false,
  dice: false
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
      click: () => modal.value.payment = true
    })
    if(!!show.value.action.giftcode) action.push({
      label: 'Giftcode',
      icon: 'i-bx-barcode-reader',
      click: () => modal.value.giftcode = true
    })
    list.push(action)
  }

  // Shop
  if(!!show.value.shop.item || !!show.value.shop.currency){
    const shop = []
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
  if(!!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.lunanewyear){
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
    if(!!show.value.event.lunanewyear) event.push({
      label: 'SK Tết Nguyên Đán',
      icon: 'i-bx-party',
      click: () => useTo().navigateToSSL('/main/lunanewyear')
    })
    list.push(event)
  }

  // Minigame
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    const minigame = []
    if(!!show.value.minigame.wheel) minigame.push({
      label: 'Vòng quay',
      icon: 'i-bxs-color',
      click: () => modal.value.wheel = true
    })
    if(!!show.value.minigame.dice) minigame.push({
      label: 'Xúc xắc',
      icon: 'i-bx-dice-6',
      click: () => modal.value.dice = true
    })
    list.push(minigame)
  }

  return list
})
</script>