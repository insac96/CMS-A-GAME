<template>
  <div class="px-2">
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
          {{ item.label }}
        </UButton>
      </template>

      <template #log>
        <AdminUserLog :user="user" />
      </template>

      <template #ip>
        <AdminUserIp :user="user" />
      </template>

      <template #payment>
        <DataPaymentHistory :user="user" />
      </template>

      <template #shop>
        <DataShopHistory :user="user" />
      </template>

      <template #event>
        <DataEventHistory :user="user" />
      </template>

      <template #giftcode>
        <DataGiftcodeHistory :user="user" />
      </template>

      <template #wheel>
        <DataMinigameWheelHistory :user="user" />
      </template>

      <template #dice>
        <DataMinigameDiceHistory :user="user" />
      </template>
    </UAccordion>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const menu = [
  {
    label: 'Dòng thời gian',
    slot: 'log'
  },
  {
    label: 'Địa chỉ IP',
    slot: 'ip'
  },
  {
    label: 'Nạp tiền',
    slot: 'payment'
  },
  {
    label: 'Cửa hàng',
    slot: 'shop'
  },
  {
    label: 'Sự kiện',
    slot: 'event'
  },
  {
    label: 'Giftcode',
    slot: 'giftcode'
  },
  {
    label: 'Vòng quay',
    slot: 'wheel'
  },
  {
    label: 'Xúc xắc',
    slot: 'dice'
  }
]
</script>