<template>
  <UiFlex class="gap-4" justify="center">
    <div v-for="(menu, index) in navItems" :key="index">
      <UButton v-if="!menu.children" :label="menu.label" :to="menu.to" :padded="false" color="white" variant="link" />

      <UDropdown v-else :items="[menu.children]" :popper="{ placement: 'bottom-start' }">
        <UButton :label="menu.label" :padded="false" color="white" variant="link" />
      </UDropdown>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const emit = defineEmits(['to'])

const show = ref(configStore.config.menu)

const navItems = computed(() => {
  const list =  []

  // Action
  if(!!show.value.action.payment){
    list.push({ label: 'Nạp xu', to: '/main/action/payment' })
  }

  if(!!show.value.action.giftcode){
    list.push({ label: 'Giftcode', to: '/main/action/giftcode'})
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item){
    const action = { label: 'Cửa Hàng', children: [] }
    if(!!show.value.shop.pack) action.children.push({ label: 'Gói', to: '/main/shop/pack' })
    if(!!show.value.shop.item) action.children.push({ label: 'Vật phẩm', to: '/main/shop/item' })
    list.push(action)
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    const action = { label: 'Sự Kiện', children: [] }

    if(!!show.value.event.referral) action.children.push({ label: 'Mời bạn', to: '/main/event/referral' })
    if(!!show.value.event.login) action.children.push({ label: 'Đăng nhập', to: '/main/event/login' })
    if(!!show.value.event.pay) action.children.push({ label: 'Tích nạp', to: '/main/event/pay' })
    if(!!show.value.event.spend) action.children.push({ label: 'Tiêu phí', to: '/main/event/spend' })
    if(!!show.value.event.paymusty) action.children.push({ label: 'Đơn nạp', to: '/main/event/paymusty' })
    if(!!show.value.event.paydays) action.children.push({ label: 'Liên nạp', to: '/main/event/paydays' })
    
    list.push(action)
  }

  // Mini Game
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    const action = { label: 'Mini Game', children: [] }

    if(!!show.value.minigame.wheel) action.children.push({ label: 'Vòng quay', to: '/main/minigame/wheel' })
    if(!!show.value.minigame.dice) action.children.push({ label: 'Xúc xắc', to: '/main/minigame/dice' })

    list.push(action)
  }

  // Rank
  if(!!show.value.rank.level || !!show.value.rank.power){
    const action = { label: 'Xếp Hạng', children: [] }

    if(!!show.value.rank.level) action.children.push({ label: 'Cấp độ', to: '/main/rank/level' })
    if(!!show.value.rank.power) action.children.push({ label: 'Lực chiến', to: '/main/rank/power' })

    list.push(action)
  }

  return list
})
</script>