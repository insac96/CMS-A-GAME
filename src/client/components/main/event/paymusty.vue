<template>
  <div>
    <div class="relative min-h-[200px]">
      <LoadingTable v-if="loading" />

      <div v-else>
        <DataEmpty v-if="!activeConfig.active" :text="activeConfig.title"></DataEmpty>
        
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" v-else>
          <UTable :rows="list" :columns="columns">
            <template #need-data="{ row }">
              <UiText weight="semibold">{{ useMoney().toMoney(row.need) }} VNĐ</UiText>
            </template>

            <template #gift-data="{ row }">
              <DataItemList :items="row.gift" :currency="row.currency" class="sm:min-w-[auto] min-w-[250px]" />
            </template>

            <template #actions-data="{ row }">
              <UButton 
                size="xs"
                :color="statusFormat[row.status].color"
                :disabled="row.status != 0"
                @click="openReceive(row)"
              >{{ statusFormat[row.status].label }}</UButton>
            </template>
          </UTable>
        </UCard>
      </div>

      <UModal v-model="modal.receive" prevent-close>
        <DataEventReceive :event="stateReceive" @done="doneReceive" @close="modal.receive = false" class="p-4" />
      </UModal>

      <UModal v-model="modal.statistical" :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }" v-if="!!authStore.isLogin">
        <DataUserStatistical type-default="count" />
      </UModal>
    </div>
  </div>
</template>

<script setup>
const { dayjs, displayFull } = useDayJs()
const authStore = useAuthStore()
watch(() => authStore.isLogin, () => getList())

const loading = ref(true)

const modal = ref({
  statistical: false,
  receive: false
})
watch(() => modal.value.receive, (val) => !val && (stateReceive.value = null))

const config = ref({
  start: null,
  end: null,
  display: 0
})
const list = ref([])
const type = ref('paymusty')
watch(() => type.value, () => getList())

const columns = [{
  key: 'need',
  label: 'Nạp đơn',
},{
  key: 'gift',
  label: 'Phần thưởng',
},{
  key: 'actions',
  label: 'Trạng thái'
}]

const statusFormat = {
  '-3': { color: 'gray', label: 'Lỗi' },
  '-2': { color: 'gray', label: 'Chưa đăng nhập' },
  '-1': { color: 'gray', label: 'Chưa đạt' },
  '0': { color: 'primary', label: 'Nhận' },
  '1': { color: 'gray', label: 'Đã nhận' },
}

// Active
const activeConfig = computed(() => {
  if(!!loading.value) return { active: false, title: 'Đang tải...' }
  return { active: true }
})

// Receive
const stateReceive = ref(null)

const openReceive = (row) => {
  stateReceive.value = row
  modal.value.receive = true
}

const doneReceive = () => {
  modal.value.receive = false
  getList()
}

const getList = async () => {
  try {
    loading.value = true
    const get = await useAPI('event/list', {
      type: type.value
    })

    list.value = get.list
    config.value = Object.assign(config.value, get.config)
    loading.value = false
  }
  catch(e){
    list.value = []
    loading.value = false
  }
}

getList()
</script>