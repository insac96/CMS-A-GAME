<template>
  <div class="fixed bottom-0 w-full z-50 p-4">
    <UiFlex class="bg-gray-800 py-2.5 px-4 rounded-3xl shadow-2xl max-w-[500px] mx-auto" justify="between">
      <NuxtLink :to="item.to" v-for="(item, index) in items" :key="index">
        <UiFlex type="col" justify="center" items="center" class="gap-1">
          <UiIcon :name="item.icon" size="6" />
          <UiText size="xs" mini>{{ item.label }}</UiText>
        </UiFlex>
      </NuxtLink>
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const show = ref(configStore.config.menu)

const items = computed(() => {
  const list =  []

  // Action
  if(!!show.value.action.payment){
    list.push({ label: 'Nạp xu', to: '/main/action/payment', icon: 'bxs-credit-card' })
  }

  if(!!show.value.action.giftcode){
    list.push({ label: 'Giftcode', to: '/main/action/giftcode', icon: 'bxs-gift' })
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item || !!show.value.shop.recharge){
    list.push({ label: 'Cửa Hàng', to: '/main/shop', icon: 'bxs-shopping-bag' })
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    list.push({ label: 'Sự Kiện', to: '/main/event', icon: 'bxs-calendar' })
  }

  // Mini Game
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    list.push({ label: 'MGame', to: '/main/minigame', icon: 'bxs-game' })
  }

  // Rank
  if(!!show.value.rank.level || !!show.value.rank.power){
    list.push({ label: 'Xếp Hạng', to: '/main/rank', icon: 'bxs-bar-chart-alt-2' })
  }

  return list
})
</script>