<template>
  <UiContent title="Statistic" sub="Thống kê số liệu">
    <AdminStatisticFast class="mb-4"/>

    <DataChartLine class="mb-4" :source="source"/>

    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <AdminStatisticPayment v-if="tab == 0" v-model="source" />
    <AdminStatisticSpend v-if="tab == 1" v-model="source" />
    <AdminStatisticSignin v-if="tab == 2" v-model="source" />
    <AdminStatisticSignup v-if="tab == 3" v-model="source" />
  </UiContent>
</template>

<script setup>
const tab = ref(0)

const tabs = [
  { label: 'Nạp tiền', key: 'payment' },
  { label: 'Chi tiêu', key: 'spend' },
  { label: 'Đăng nhập', key: 'signin' },
  { label: 'Đăng ký', key: 'signup' },
]

const source = ref([])
</script>