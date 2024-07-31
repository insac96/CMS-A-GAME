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
    if(!!show.value.action.giftcode) action.children.push({ label: 'Giftcode', to: '/main/action/giftcode' })

    list.push(action)
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item){
    const action = {
      label: 'Cửa Hàng',
      icon: 'i-bx-shopping-bag',
      defaultOpen: true,
      slot: 'shop',
      children: []
    }

    if(!!show.value.shop.pack) action.children.push({ label: 'Gói', to: '/main/shop/pack' })
    if(!!show.value.shop.recharge) action.children.push({ label: 'Nạp game', to: '/main/shop/recharge' })
    if(!!show.value.shop.item) action.children.push({ label: 'Vật phẩm', to: '/main/shop/item' })

    list.push(action)
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    const action = {
      label: 'Sự Kiện',
      icon: 'i-bx-calendar',
      defaultOpen: true,
      slot: 'event',
      children: []
    }

    if(!!show.value.event.referral) action.children.push({ label: 'Mời bạn', to: '/main/event/referral' })
    if(!!show.value.event.login) action.children.push({ label: 'Đăng nhập', to: '/main/event/login' })
    if(!!show.value.event.pay) action.children.push({ label: 'Tích nạp', to: '/main/event/pay' })
    if(!!show.value.event.spend) action.children.push({ label: 'Tiêu phí', to: '/main/event/spend' })
    if(!!show.value.event.paymusty) action.children.push({ label: 'Đơn nạp', to: '/main/event/paymusty' })
    if(!!show.value.event.paydays) action.children.push({ label: 'Liên nạp', to: '/main/event/paydays' })
    
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