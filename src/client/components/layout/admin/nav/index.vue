<template>
  <div>
    <UButton block size="md" class="mb-2" @click="openLink(runtimeConfig.public.clientURL)">Trang Chủ</UButton>

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
      <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emit('to')"/></template>
      <template #tab-7><UVerticalNavigation :links="navItems[7].children" @click="emit('to')"/></template>
      <template #tab-8><UVerticalNavigation :links="navItems[8].children" @click="emit('to')"/></template>
      <template #tab-9><UVerticalNavigation :links="navItems[9].children" @click="emit('to')"/></template>
      <template #tab-10><UVerticalNavigation :links="navItems[10].children" @click="emit('to')"/></template>
      <template #tab-11><UVerticalNavigation :links="navItems[11].children" @click="emit('to')"/></template>
      <template #tab-12><UVerticalNavigation :links="navItems[12].children" @click="emit('to')"/></template>
    </UAccordion>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Thống kê', to: '/@eni/statistic' },
      { label: 'Cài đặt', to: '/@eni/config' },
    ]
  },
  {
    label: 'Quảng cáo',
    icon: 'i-bx-spreadsheet',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: 'Landing', to: '/@eni/ads/landing' },
      { label: 'From', to: '/@eni/ads/from' }
    ]
  },
  {
    label: 'Thời gian thực',
    icon: 'i-bxs-timer',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: 'Chức năng', to: '/@eni/socket/action' },
      { label: 'Kênh chat', to: '/@eni/socket/chat' },
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
    { label: 'Danh mục', to: '/@eni/news/category' }, 
    { label: 'Danh sách', to: '/@eni/news' }, 
    ]
  },
  {
    label: 'Tài khoản',
    icon: 'i-bx-user',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
      { label: 'Danh sách', to: '/@eni/user' }, 
      { label: 'Cấp độ', to: '/@eni/user/level' },
      { label: 'Chức năng', to: '/@eni/user/action' }, 
    ]
  },
  {
    label: 'Nạp tiền',
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: 'Cài đặt', to: '/@eni/payment/config' }, 
      { label: 'Kênh nạp', to: '/@eni/payment/gate' }, 
      { label: 'Danh sách', to: '/@eni/payment' }, 
    ]
  },
  {
    label: 'Đổi xu',
    icon: 'i-bx-money-withdraw',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
      { label: 'Danh sách', to: '/@eni/withdraw' }, 
    ]
  },
  {
    label: 'Trò chơi',
    icon: 'i-bx-cube-alt',
    defaultOpen: false,
    slot: 'tab-7',
    children: [
      { label: 'Gửi thư', to: '/@eni/game/send' },
      { label: 'Vật phẩm', to: '/@eni/game/item' },
      { label: 'Gói vật phẩm', to: '/@eni/game/itembox' }, 
      { label: 'Máy chủ', to: '/@eni/game/server' },
      { label: 'Nhân vật', to: '/@eni/game/roles' },
      { label: 'Quà xếp hạng', to: '/@eni/game/rankgift' },
    ]
  },
  {
    label: 'Giftcode',
    icon: 'i-bx-barcode-reader',
    defaultOpen: false,
    slot: 'tab-8',
    children: [
      { label: 'Danh sách', to: '/@eni/giftcode' }, 
      { label: 'Lịch sử', to: '/@eni/giftcode/history' }, 
    ]
  },
  {
    label: 'Cửa hàng',
    icon: 'i-bx-shopping-bag',
    defaultOpen: false,
    slot: 'tab-9',
    children: [
      { label: 'Cài đặt', to: '/@eni/shop/config' },
      { label: 'Gói', to: '/@eni/shop/pack' },
      { label: 'Vật phẩm', to: '/@eni/shop/item' },
      { label: 'Tiền tệ', to: '/@eni/shop/currency' }, 
      { label: 'Lịch sử', to: '/@eni/shop/history' }, 
    ]
  },
  {
    label: 'Sự Kiện',
    icon: 'i-bx-calendar',
    defaultOpen: false,
    slot: 'tab-10',
    children: [
      { label: 'Cặt đặt', to: '/@eni/event/config' }, 
      { label: 'Đăng nhập', to: '/@eni/event/login' }, 
      { label: 'Tích nạp', to: '/@eni/event/pay' }, 
      { label: 'Tiêu phí', to: '/@eni/event/spend' },
      { label: 'Giới thiệu', to: '/@eni/event/referral' },
      { label: 'Lịch sử', to: '/@eni/event/history' },
    ]
  },
  {
    label: 'Mini Game',
    icon: 'i-bx-game',
    defaultOpen: false,
    slot: 'tab-11',
    children: [
      { label: 'Vòng quay', to: '/@eni/minigame/wheel' }, 
      { label: 'Xúc xắc', to: '/@eni/minigame/dice' }
    ]
  },
  {
    label: 'Nhật ký',
    icon: 'i-bx-book',
    defaultOpen: false,
    slot: 'tab-12',
    children: [
      { label: 'Quản trị viên', to: '/@eni/log/admin' }, 
      { label: 'Gửi vật phẩm', to: '/@eni/log/adminSendItem' },
      { label: 'Địa chỉ IP', to: '/@eni/log/ip' }
    ]
  }
]

const openLink = (link) => {
  window.location.href = link
}
</script>