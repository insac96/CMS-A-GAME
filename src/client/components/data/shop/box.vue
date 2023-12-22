<template>
  <UCard
    v-if="item" 
    :ui="{ 
      base: 'relative transition-all cursor-pointer',
      background: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      rounded: 'rounded-xl',
      shadow: 'shadow-md hover:shadow-lg',
      body: { padding: 'px-2 sm:px-2 py-6 sm:py-6' },
      divide: '',
      ring: 'dark:ring-1 ring-0 hover:ring-2 dark:hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400'
    }"
  > 
    <DataItemImage 
      :src="item.image || null"
      :type="item.type"
      :size="100"
      class="mb-4 mx-auto" 
    />

    <UiText 
      color="primary"
      weight="bold"
      align="center"
      class="truncate lg:text-base text-sm mb-1 px-2"
    >
      {{ item.item_amount > 1 ? `x${miniMoney(item.item_amount)}` : '' }} {{ item.name }}
    </UiText>

    <UiText 
      weight="semibold"
      color="gray"
      align="center"
      class="truncate lg:text-xs text-[10px] mb-4"
    >
      {{ typeFormat[item.type] }}
    </UiText>
    
    <UiFlex justify="center">
      <UButtonGroup size="xs" orientation="horizontal">
        <UButton :label="miniMoney(item.price)" color="gray" />
        <UButton  color="primary" icon="i-bxs-dollar-circle"></UButton>
      </UButtonGroup>
    </UiFlex>
  </UCard>
</template>

<script setup>
const props = defineProps(['item'])
const { miniMoney } = useMoney()

const typeFormat = {
  1: 'Gói Nạp',
  2: 'Vật Phẩm',
  'wheel': 'Tiền Tệ',
  'notify': 'Tiền Tệ'
}
</script>