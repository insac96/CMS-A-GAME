<template>
  <div>
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" size="lg" class="mr-auto"/>
    
      <SelectDate v-model="page.range.start" placeholder="Bắt đầu" class="ml-2 max-w-[140px]"/>
      <SelectDate v-model="page.range.end" placeholder="Kết thúc" class="ml-1 max-w-[140px]"/>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #time-data="{ row }">
          <UiText color="primary" weight="semibold">{{row.timeformat}} {{ useDayJs().displayTime(row.time) }}</UiText>
        </template>

        <template #money_total-data="{ row }">
          {{  useMoney().toMoney(row.money_total) }}
        </template>

        <template #money_card-data="{ row }">
          {{  useMoney().toMoney(row.money_card) }}
        </template>

        <template #money_bank-data="{ row }">
          {{  useMoney().toMoney(row.money_bank) }}
        </template>

        <template #money_momo-data="{ row }">
          {{  useMoney().toMoney(row.money_momo) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>
  </div>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'time',
    label: 'Thời gian',
    sortable: true
  },{
    key: 'count_total',
    label: 'G.Dịch',
    sortable: true
  },{
    key: 'count_waiting',
    label: 'C.Duyệt',
    sortable: true
  },{
    key: 'count_refuse',
    label: 'T.Bại',
    sortable: true
  },{
    key: 'count_success',
    label: 'T.Công',
    sortable: true
  },{
    key: 'money_total',
    label: 'Tổng',
    sortable: true
  },{
    key: 'money_card',
    label: 'Thẻ cào',
    sortable: true
  },{
    key: 'money_bank',
    label: 'Ngân hàng',
    sortable: true
  },{
    key: 'money_momo',
    label: 'Momo',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'time',
    direction: 'desc'
  },
  range: {
    start: null,
    end: null
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getList()
  if(!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getList()
  if(!val && !page.value.range.start) return getList()
})


// Loading
const loading = ref({
  load: true,
})
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('statistic/payment', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
