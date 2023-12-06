<template>
  <div>
    <UiFlex class="mb-2" >
      <USelectMenu 
        v-model="type" 
        size="sm"
        value-attribute="value"
        option-attribute="label"
        :options="[
          { label: 'Đăng nhập tháng', value: 'login.month' },
          { label: 'Đăng nhập tổng', value: 'login.total' },
        ]"
        class="mr-auto"
      >
        <template #label>
          <UiText mini>{{ typeFormat[type] }}</UiText>
        </template>
      </USelectMenu>  

      <UButton size="sm" color="gray" @click="modal.statistical = true" v-if="!!authStore.isLogin">Thống kê</UButton>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading" />

      <UTable :rows="list" :columns="columns">
        <template #need-data="{ row }">
          <UiText weight="semibold">{{ row.need }} ngày</UiText>
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

      <UModal v-model="modal.receive" prevent-close>
        <DataEventReceive :event="stateReceive" @done="doneReceive" @close="modal.receive = false" class="p-4" />
      </UModal>

      <UModal v-model="modal.statistical" :ui="{ width: 'md:max-w-2xl sm:max-w-xl' }" v-if="!!authStore.isLogin">
        <DataUserStatistical type-default="count" />
      </UModal>
    </UCard>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
watch(() => authStore.isLogin, () => getList())

const loading = ref(true)

const modal = ref({
  statistical: false,
  receive: false
})

const stateReceive = ref(null)
const openReceive = (row) => {
  stateReceive.value = row
  modal.value.receive = true
}
watch(() => modal.value.receive, (val) => !val && (stateReceive.value = null))

const list = ref([])
const type = ref('login.month')
const typeFormat = {
  'login.month': 'Đăng nhập tháng',
  'login.total': 'Đăng nhập tổng',
}
watch(() => type.value, () => getList())

const columns = [{
  key: 'need',
  label: 'Đăng nhập',
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

    loading.value = false
    list.value = get
  }
  catch(e){
    list.value = []
    loading.value = false
  }
}

getList()
</script>