<template>
  <div>
    <UCard class="mb-2" :ui="{ body: { padding: 'p-3 sm:p-3'} }" v-if="!!authStore.isLogin && !!authStore.profile.referral_code">
      <UiFlex justify="between" >
        <UiText size="sm" weight="semibold">Mã mời của bạn</UiText>
        <UButtonGroup size="sm">
          <UButton color="gray" >{{ authStore.profile.referral_code }}</UButton>
          <UButton icon="i-bx-copy" @click="startCopy(authStore.profile.referral_code)" v-if="!!isSupported" />
        </UButtonGroup>
      </UiFlex>
    </UCard>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading" />

      <UTable :rows="list" :columns="columns">
        <template #need-data="{ row }">
          <UiText weight="semibold">{{ row.need }} người</UiText>
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
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
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
const type = ref('referral.count')

const columns = [{
  key: 'need',
  label: 'Mời',
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

const startCopy = (text) => {
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
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