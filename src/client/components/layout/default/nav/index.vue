<template>
  <div>
    <PlayBtn block class="mb-2" />

    <DataSupport class="mb-4" />

    <UAccordion 
      :items="navItems" 
      :ui="{
        'item': { padding: 'pt-0 pb-2 pl-6' },
      }"
      multiple
    >
      <template #default="{item, open}">
        <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
          <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
          <UiText 
            class="mx-4" 
            size="sm" 
            weight="semibold" 
            :color="open ? 'primary' : 'gray'"
            :text="item.label"
          />
          <UiIcon
            name="i-bx-chevron-right"
            size="5"
            :color="open ? 'primary' : 'gray'"
            class="ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </UiFlex>
      </template>
      
      <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
      <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
      <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
      <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
      <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
      <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
    </UAccordion>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const emit = defineEmits(['to'])

const show = ref(configStore.config.menu)

const navItems = computed(() => {
  const list =  [
    {
      label: 'Chức Năng',
      icon: 'i-bx-cube-alt',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-0',
      children: []
    },
    {
      label: 'Cửa Hàng',
      icon: 'i-bx-shopping-bag',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-1',
      children: []
    },
    {
      label: 'Sự Kiện',
      icon: 'i-bx-calendar',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-2',
      children: []
    },
    {
      label: 'Mini Game',
      icon: 'i-bx-game',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-3',
      children: []
    },
    {
      label: 'Xếp Hạng',
      icon: 'i-bx-bar-chart-alt-2',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-4',
      children: []
    },
    {
      label: 'Mạng Xã Hội',
      icon: 'i-bx-book-reader',
      disabled: true,
      defaultOpen: false,
      slot: 'tab-5',
      children: []
    }
  ]

  // Action
  if(!!show.value.action.payment || !!show.value.action.giftcode){
    if(!!show.value.action.payment) list[0].children.push({ label: 'Nạp xu', to: '/main/action/payment' })
    if(!!show.value.action.withdraw) list[0].children.push({ label: 'Rút tiền', to: '/main/action/withdraw' })
    if(!!show.value.action.giftcode) list[0].children.push({ label: 'Giftcode', to: '/main/action/giftcode' })
    list[0].disabled = false
    list[0].defaultOpen = true
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item || !!show.value.shop.currency){
    if(!!show.value.shop.pack) list[1].children.push({ label: 'Gói', to: '/main/shop/pack' })
    if(!!show.value.shop.item) list[1].children.push({ label: 'Vật phẩm', to: '/main/shop/item' })
    if(!!show.value.shop.currency) list[1].children.push({ label: 'Tiền tệ', to: '/main/shop/currency' })
    list[1].disabled = false
    list[1].defaultOpen = true
  }

  // Event
  if(!!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.lunanewyear){
    if(!!show.value.event.login) list[2].children.push({ label: 'Đăng nhập', to: '/main/event/login' })
    if(!!show.value.event.pay) list[2].children.push({ label: 'Tích nạp', to: '/main/event/pay' })
    if(!!show.value.event.spend) list[2].children.push({ label: 'Tiêu phí', to: '/main/event/spend' })
    if(!!show.value.event.lunanewyear) list[2].children.push({ label: 'Tết nguyên đán', to: '/main/lunanewyear' })
    list[2].disabled = false
    list[2].defaultOpen = true
  }

  // Minigame
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    if(!!show.value.minigame.wheel) list[3].children.push({ label: 'Vòng quay', to: '/main/minigame/wheel' })
    if(!!show.value.minigame.dice) list[3].children.push({ label: 'Xúc xắc', to: '/main/minigame/dice' })
    list[3].disabled = false
    list[3].defaultOpen = true
  }

  // Minigame
  if(!!show.value.rank.level || !!show.value.rank.power){
    if(!!show.value.rank.level) list[4].children.push({ label: 'Cấp độ', to: '/main/rank/level' })
    if(!!show.value.rank.power) list[4].children.push({ label: 'Lực chiến', to: '/main/rank/power' })
    list[4].disabled = false
    list[4].defaultOpen = true
  }

  // Social
  if(!!show.value.social.facebook || !!show.value.social.group){
    if(!!show.value.social.facebook) list[5].children.push({ label: 'Fanpage', to: configStore.config.social.facebook })
    if(!!show.value.social.group) list[5].children.push({ label: 'Group', to: configStore.config.social.zalo })
    list[5].disabled = false
    list[5].defaultOpen = true
  }

  return list
})
</script>