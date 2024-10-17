<template>
  <div>
    <UiFlex class="mb-2" >
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <div class="relative min-h-[200px]">
      <LoadingTable v-if="loading" />

      <div v-else>
        <DataEmpty v-if="!activeConfig.active" :text="activeConfig.title"></DataEmpty>
        
        <UiFlex v-else type="col" class="gap-4">
          <UCard v-for="(row, index) in list" :key="index" :ui="{ 
            base: 'w-full',
            body: { padding: 'py-2 sm:py-2 px-4 sm:px-4' },
            header: { padding: 'py-2 sm:py-2 px-4 sm:px-4', background: 'bg-white dark:bg-gray-800' },
          }">
            <template #header>
              <UiFlex justify="between" class="gap-1">
                <UiText weight="semibold" size="sm">{{ toMoney(row.need) }} Ngày</UiText>

                <UButton 
                  size="2xs"
                  :color="statusFormat[row.status].color"
                  :disabled="row.status != 0"
                  @click="openReceive(row)"
                >{{ statusShow(row.status, row.need) }}</UButton>
              </UiFlex>
            </template>

            <template #default>
              <DataItemList :items="row.gift" :currency="row.currency" justify="center" />
            </template>
          </UCard>
        </UiFlex>
      </div>

      <UModal v-model="modal.receive" prevent-close>
        <DataEventReceive :event="stateReceive" @done="doneReceive" @close="modal.receive = false" class="p-4" />
      </UModal>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const { toMoney } = useMoney()
watch(() => authStore.isLogin, () => getList())

const loading = ref(true)

const modal = ref({
  receive: false
})
watch(() => modal.value.receive, (val) => !val && (stateReceive.value = null))

const config = ref({
  start: null,
  end: null,
  display: 0
})

const list = ref([])
const statistical = ref()
const type = ref('login.month')
const tab = ref(0)
const tabs = [
  { label: 'Tháng', key: 'login.month' },
  { label: 'Năm', key: 'login.total' },
]
watch(() => tab.value, (val) => type.value = tabs[val]['key'])
watch(() => type.value, () => getList())

const columns = [{
  key: 'need',
  label: 'Ngày',
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

const statusShow = (number, need) => {
  if(number != -1 || !authStore.isLogin) return statusFormat[number].label
  const arrType = type.value.split('.')

  if(arrType.length > 1){
    let info = JSON.parse(JSON.stringify(statistical.value)) 
    arrType.forEach(i => {
      
      info =  info[i]
    })

    
    return `${toMoney(info)} / ${toMoney(need)}`
  }
  else {
    return `${toMoney(statistical.value[type.value])} / ${toMoney(need)}`
  }
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

const getStatistical = async () => {
  try {
    if(!authStore.isLogin) throw true

    const data = await useAPI('user/getStatistical', {
      user: authStore.profile._id
    })
    
    statistical.value = data
  }
  catch(e){
    statistical.value = null
  }
}

const getList = async () => {
  try {
    loading.value = true
    getStatistical()
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