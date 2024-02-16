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
      <!-- <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
      <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
      <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template> -->
      <template #tab-4><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
      <template #tab-5><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
    </UAccordion>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Chức Năng',
    icon: 'i-bx-cube-alt',
    defaultOpen: true,
    slot: 'tab-0',
    children: [
      { label: 'Nạp xu', to: '/main/action/payment' },
      { label: 'Giftcode', to: '/main/action/giftcode' }
    ]
  },
  // {
  //   label: 'Cửa Hàng',
  //   icon: 'i-bx-shopping-bag',
  //   defaultOpen: true,
  //   slot: 'tab-1',
  //   children: [
  //     { label: 'Gói', to: '/main/shop/pack' }, 
  //     { label: 'Vật phẩm', to: '/main/shop/item' }, 
  //     { label: 'Tiền tệ', to: '/main/shop/currency' }, 
  //   ]
  // },
  // {
  //   label: 'Sự Kiện',
  //   icon: 'i-bx-calendar',
  //   defaultOpen: true,
  //   slot: 'tab-2',
  //   children: [
  //     { label: 'Đăng nhập', to: '/main/event/login' }, 
  //     { label: 'Tích nạp', to: '/main/event/pay' }, 
  //     { label: 'Tiêu phí', to: '/main/event/spend' }
  //   ]
  // },
  // {
  //   label: 'Mini Game',
  //   icon: 'i-bx-game',
  //   defaultOpen: true,
  //   slot: 'tab-3',
  //   children: [
  //     { label: 'Vòng quay', to: '/main/minigame/wheel' }, 
  //     { label: 'Xúc xắc', to: '/main/minigame/dice' }
  //   ]
  // },
  {
    label: 'Xếp Hạng',
    icon: 'i-bx-bar-chart-alt-2',
    defaultOpen: true,
    slot: 'tab-4',
    children: [
      { label: 'Cấp độ', to: '/main/rank/level' },
      { label: 'Lực chiến', to: '/main/rank/power' }, 
    ]
  },
  {
    label: 'Mạng Xã Hội',
    icon: 'i-bx-book-reader',
    defaultOpen: true,
    slot: 'tab-5',
    children: [
      { label: 'Fanpage', to: configStore.config.social.facebook, target: '_blank' }, 
      { label: 'Group', to: configStore.config.social.zalo, target: '_blank' },
    ]
  }
]
</script>