<template>
  <UiContent title="Roles" sub="Quản lý nhân vật trò chơi">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" :disabled="!page.server_id" class="mr-2"/>

      <UForm @submit="getList" class="mr-auto">
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
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns"  :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>
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
watch(() => page.value.server_id, (val) => getList())

// Modal
const modal = ref({
})

// Loading
const loading = ref({
  load: true,
})

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

getList()
</script>
