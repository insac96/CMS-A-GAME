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
      
      <template #[i.slot] v-for="i in navItems" :key="i.slot">
        <UVerticalNavigation :links="i.children" @click="emit('to')"/>
      </template>
    </UAccordion>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const emit = defineEmits(['to'])

const show = ref(configStore.config.menu)

const navItems = computed(() => {
  const list =  []

  // Action
  if(!!show.value.action.payment || !!show.value.action.giftcode){
    const action = {
      label: 'Chức Năng',
      icon: 'i-bx-cube-alt',
      defaultOpen: true,
      slot: 'action',
      children: []
    }

    if(!!show.value.action.payment) action.children.push({ label: 'Nạp xu', to: '/main/action/payment' })
    if(!!show.value.action.withdraw) action.children.push({ label: 'Rút tiền', to: '/main/action/withdraw' })
    if(!!show.value.action.giftcode) action.children.push({ label: 'Giftcode', to: '/main/action/giftcode' })

    list.push(action)
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item || !!show.value.shop.currency){
    const action = {
      label: 'Cửa Hàng',
      icon: 'i-bx-shopping-bag',
      defaultOpen: true,
      slot: 'shop',
      children: []
    }

    if(!!show.value.shop.pack) action.children.push({ label: 'Gói', to: '/main/shop/pack' })
    if(!!show.value.shop.item) action.children.push({ label: 'Vật phẩm', to: '/main/shop/item' })
    if(!!show.value.shop.currency) action.children.push({ label: 'Tiền tệ', to: '/main/shop/currency' })

    list.push(action)
  }

  // Event
  if(!!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.lunanewyear){
    const action = {
      label: 'Sự Kiện',
      icon: 'i-bx-calendar',
      defaultOpen: true,
      slot: 'event',
      children: []
    }

    if(!!show.value.event.login) action.children.push({ label: 'Đăng nhập', to: '/main/event/login' })
    if(!!show.value.event.pay) action.children.push({ label: 'Tích nạp', to: '/main/event/pay' })
    if(!!show.value.event.spend) action.children.push({ label: 'Tiêu phí', to: '/main/event/spend' })
    if(!!show.value.event.lunanewyear) action.children.push({ label: 'Tết nguyên đán', to: '/main/lunanewyear' })

    list.push(action)
  }

  // Minigame
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    const action = {
      label: 'Mini Game',
      icon: 'i-bx-game',
      defaultOpen: true,
      slot: 'minigame',
      children: []
    }

    if(!!show.value.minigame.wheel) action.children.push({ label: 'Vòng quay', to: '/main/minigame/wheel' })
    if(!!show.value.minigame.dice) action.children.push({ label: 'Xúc xắc', to: '/main/minigame/dice' })

    list.push(action)
  }

  // Rank
  if(!!show.value.rank.level || !!show.value.rank.power){
    const action = {
      label: 'Xếp Hạng',
      icon: 'i-bx-bar-chart-alt-2',
      defaultOpen: true,
      slot: 'rank',
      children: []
    }

    if(!!show.value.rank.level) action.children.push({ label: 'Cấp độ', to: '/main/rank/level' })
    if(!!show.value.rank.power) action.children.push({ label: 'Lực chiến', to: '/main/rank/power' })

    list.push(action)
  }

  // Social
  if(!!show.value.social.facebook || !!show.value.social.group){
    const action = {
      label: 'Mạng Xã Hội',
      icon: 'i-bx-book-reader',
      defaultOpen: true,
      slot: 'social',
      children: []
    }

    if(!!show.value.social.facebook) action.children.push({ label: 'Fanpage', to: configStore.config.social.facebook })
    if(!!show.value.social.group) action.children.push({ label: 'Group', to: configStore.config.social.zalo })

    list.push(action)
  }

  return list
})
</script>