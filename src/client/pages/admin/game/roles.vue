<template>
  <UiContent title="Roles" sub="Quản lý nhân vật trò chơi">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" :disabled="!page.server_id" class="mr-2"/>

      <UForm :state="page" @submit="getList" class="mr-auto">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" :disabled="!page.server_id" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'ROLE']" :disabled="!page.server_id" />
        </UiFlex>
      </UForm>

      <SelectGameServer v-model="page.server_id" size="sm" class="ml-1" />
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #power-data="{row}">
          {{ useMoney().toMoney(row.power) }}
        </template>

        <template #action-data="{row}">
          <UButton icon="i-bx-mail-send" color="gray" :disabled="!!loading.send" @click="openSend(row)" class="mr-1" />
          <UButton icon="i-bx-play" color="gray" :disabled="!!loading.play" @click="openPlay(row)" />
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns"  :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5"/>
    </UiFlex>

    <!-- Modal Send -->
    <UModal v-model="modal.send" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UForm :state="stateSend" :validate="validate" @submit="actionSend" class="p-4">
        <UFormGroup label="Nhân vật">
          <UInput :model-value="`${stateSend.username} - ${stateSend.role_name}`" readonly />
        </UFormGroup>

        <UFormGroup label="Tiêu đề">
          <UInput v-model="stateSend.title" placeholder="Có thể để trống" />
        </UFormGroup>

        <UFormGroup label="Nội dung">
          <UInput v-model="stateSend.content" placeholder="Có thể để trống" />
        </UFormGroup>

        <UFormGroup label="Lý do" name="reason">
          <UTextarea v-model="stateSend.reason" />
        </UFormGroup>

        <UFormGroup name="items">
          <SelectItemList v-model="stateSend.items" :types="['game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.send">Gửi</UButton>
          <UButton color="gray" @click="modal.send = false" :disabled="loading.send" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'account',
    label: 'Tài khoản',
  },{
    key: 'role_name',
    label: 'Tên',
  },{
    key: 'level',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'power',
    label: 'Lực chiến',
    sortable: true
  },{
    key: 'action',
    label: 'Chức năng'
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  server_id: null,
  size: 10,
  current: 1,
  sort: {
    column: 'power',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'USER'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.server_id, () => getList())

// State
const stateSend = ref({
  user: null,
  server: null,
  role: null,
  title: null,
  content: null,
  reason: null,
  items: [],

  username: null,
  role_name: null,
})

// Modal
const modal = ref({
  send: false
})

watch(() => modal.value.send, (val) => !val && (stateSend.value = {
  user: null,
  server: null,
  role: null,
  title: null,
  content: null,
  reason: null,
  items: [],

  username: null,
  role_name: null,
}))

// Loading
const loading = ref({
  load: false,
  send: false,
  play: false
})

// Send
const openSend = async (row) => {
  try {
    loading.value.send = true
    const id = await useAPI('user/admin/getIDByUsername', {
      username: row.account
    })

    stateSend.value.user = id
    stateSend.value.server = page.value.server_id
    stateSend.value.role = row.role_id
    stateSend.value.username = row.account
    stateSend.value.role_name = row.role_name

    loading.value.send = false
    modal.value.send = true
  }
  catch (e) {
    loading.value.send = false
  }
}

// Play
const openPlay = async (row) => {
  try {
    loading.value.play = true
    const url = await useAPI('game/admin/start', {
      username: row.account
    })

    window.open(url, '_blank')
    loading.value.play = false
  }
  catch (e) {
    loading.value.play = false
  }
}

const validate = (state) => {
  const errors = []
  if(!state.reason) errors.push({ path: 'reason', message: 'Vui lòng nhập lý do' })
  if(state.items.length < 1) errors.push({ path: 'items', message: 'Vui lòng thêm vật phẩm' })
  return errors
}

const actionSend = async () => {
  try {
    loading.value.send = true
    await useAPI('game/admin/send', JSON.parse(JSON.stringify(stateSend.value)))

    loading.value.send = false
    modal.value.send = false
  }
  catch(e) {
    loading.value.send = false
  }
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/admin/roles', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}
</script>
