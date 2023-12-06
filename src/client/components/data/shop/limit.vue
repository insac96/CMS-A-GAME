<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <LoadingTable v-if="loading" />

    <UTable :columns="columns" :rows="data">
      <template #coin-data="{ row }">
        <span v-if="row.coin == -1">Không giới hạn</span>
        <span v-else>{{ toMoney(row.coin) }}</span>
      </template>

      <template #count-data="{ row }">
        <span v-if="row.count == -1">Không giới hạn</span>
        <span v-else>{{ toMoney(row.count) }}</span>
      </template>
    </UTable>
  </UCard>
</template>

<script setup>
const { toMoney } = useMoney()

const props = defineProps({
  modelValue: Object,
  level: [ Number, String ],
  auth: Boolean
})
const emit = defineEmits(['update:modelValue'])

const loading = ref(true)
const levelData = ref(undefined)
const authData = ref(undefined)

const columns = computed(() => [
  {
    key: 'time',
    label: `Cấp ${levelData.value ? levelData.value.number : '0'}`
  },{
    key: 'coin',
    label: 'Số Xu được tiêu'
  },{
    key: 'count',
    label: 'Số lần được tiêu'
  }
])

const data =  computed({
  get: () => {
    const limit = levelData.value && (levelData.value.limit ? levelData.value.limit.spend : null)
    const spend = authData.value && (authData.value.spend || null)
    let limitCoinDay, limitCountyDay, limitCoinMonth, limitCountMonth

    if(!limit) {
      emit('update:modelValue', { day: null, month: null })
      return []
    }
    else {
      if(!spend) {
        limitCoinDay = limit.day?.coin == 0 ? -1 : limit.day?.coin
        limitCountyDay = limit.day?.count == 0 ? -1 : limit.day?.count
        limitCoinMonth = limit.month?.coin == 0 ? -1 : limit.month?.coin
        limitCountMonth = limit.month?.count == 0 ? -1 : limit.month?.count
      }
      if(!!spend) {
        limitCoinDay = limit.day?.coin == 0 ? -1 : (limit.day?.coin - spend.day?.coin) < 0 ? 0 : (limit.day?.coin - spend.day?.coin)
        limitCountyDay = limit.day?.count == 0 ? -1 : (limit.day?.count - spend.day?.count) < 0 ? 0 : (limit.day?.count - spend.day?.count)
        limitCoinMonth = limit.month?.coin == 0 ? -1 : (limit.month?.coin - spend.month?.coin) < 0 ? 0 : (limit.month?.coin - spend.month?.coin)
        limitCountMonth = limit.month?.count == 0 ? -1 : (limit.month?.count - spend.month?.count) < 0 ? 0 : (limit.month?.count - spend.month?.count)
      }

      const result = [
        { time: 'Ngày', coin: limitCoinDay, count: limitCountyDay },
        { time: 'Tháng', coin: limitCoinMonth, count: limitCountMonth },
      ]
      
      emit('update:modelValue', { day: result[0], month: result[1] })
      return result
    }
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const fetch = async () => {
  try {
    const get = await useAPI('level/limit', { 
      number: props.level,
      auth: props.auth
    })
    
    levelData.value = get.level
    authData.value = get.auth
    loading.value = false
  }
  catch (e) {
    levelData.value = undefined
    authData.value = undefined
    loading.value = false
  }
}
fetch()
</script>