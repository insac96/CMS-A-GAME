<template>
  <DataEmpty text="Không có thông báo" icon="i-bx-bell-off" v-if="!list || list.length == 0" />
  
  <!-- List -->
  <UAlert
    v-for="(item, index) in list" :key="item._id"
    :avatar="{ src: item.from?.avatar, size: 'xs' }"
    :color="item.color"
    variant="soft"
    class="my-2"
  >
    <!-- Title -->
    <template #title>
      <UiFlex>
        <!-- Main -->
        <UiFlex>
          <div class="inline mr-1" v-if="
            item.global == 1 
            || item.pin == 1 
            || item.to[0] && item.to[0].watched == 0
          ">
            <UBadge :color="item.color" size="xs" variant="soft" class="mr-px" v-if="item.to[0] && item.to[0].watched == 0">
              <UiIcon name="i-bxs-low-vision" />
            </UBadge>

            <UBadge :color="item.color" size="xs" variant="soft" class="cursor-pointer mr-px" v-if="item.global == 1" @click="showEditGlobal(item, index)">
              <UiIcon name="i-bx-world" />
            </UBadge>
            
            <UBadge :color="item.color" size="xs" variant="soft" class="mr-px" v-if="item.pin == 1">
              <UiIcon name="i-bxs-pin" />
            </UBadge>
          </div>

          <UiText
            size="xs"
            weight="semibold"
            pointer
            class="capitalize pr-4" 
            @click="showUserBox(item.from._id)"
          >
            {{ item.from?.username }} {{ item.title ? ` - ${item.title}` : undefined }}
          </UiText>
        </UiFlex>

        <!-- Time -->
        <UiText size="xs" align="right" no-wrap class="ml-auto">
          {{ fromTime(item.createdAt, null, true) }}
        </UiText>
      </UiFlex>
    </template>

    <!-- Description -->
    <template #description>
      <div class="leading-5 break-words">
        <div v-html="item.content" class="inline"></div>

        <UiText 
          v-if="item.link" 
          size="xs"
          weight="semibold"
          pointer
          class="inline italic" 
          @click="goLink(item.link)"
        >...xem</UiText>
      </div>
    </template>
  </UAlert>

  <!-- Modal User Box -->
  <UModal v-model="modalUserBox" :ui="{ width: 'max-w-xs sm:max-w-xs' }">
    <DataUserBox :fetch-id="userSelect" />
  </UModal>

  <!-- Modal Edit Global -->
  <UModal v-model="modalEditGlobal">
    <AdminNotifyUserEditGlobal
      :notify="notifyGlobalSelect.data" 
      @cancel="cancelEditGlobal" 
      @edit="doneEditGlobal" 
      @delete="doneDeleteGlobal" 
    />
  </UModal>
</template>

<script setup>
const { fromTime } = useDayJs()
const props = defineProps(['source'])
const emit = defineEmits(['to'])
const authStore = useAuthStore()

// List
const list = ref(props.source ? JSON.parse(JSON.stringify(props.source)) : undefined)

// User Box
const modalUserBox = ref(false)
const userSelect = ref(undefined)
const showUserBox = (_id) => {
  userSelect.value = _id
  modalUserBox.value = true
}

// Edit Global
const modalEditGlobal = ref(false)
const notifyGlobalSelect = ref({
  index: undefined,
  data: undefined
})
const showEditGlobal = (notify, index) => {
  if(authStore.profile?.type < 1) return
  if(notify.global == 0) return

  notifyGlobalSelect.value.index = index
  notifyGlobalSelect.value.data = notify
  modalEditGlobal.value = true
}
const cancelEditGlobal = () => {
  notifyGlobalSelect.value.index = undefined
  notifyGlobalSelect.value.data = undefined
  modalEditGlobal.value = false
}
const doneEditGlobal = (update) => {
  const index = notifyGlobalSelect.value.index
  const notify = list.value[index]
  if(notify){
    list.value[index] = Object.assign(notify, update)
  }
  cancelEditGlobal()
}
const doneDeleteGlobal = () => {
  const index = notifyGlobalSelect.value.index
  list.value.splice(index, 1)
  cancelEditGlobal()
}

// Go to Link
const goLink = (link) => {
  const httpFormat = link.split('://')
  const nuxtFormat = link.split('/')

  if(httpFormat.length > 0 && (httpFormat[0] == 'http' || httpFormat[0] == 'https')){
    window.open(link, '_blank')
    return emit('to')
  }
  if(nuxtFormat[0] == ''){
    navigateTo(link)
    return emit('to')
  }

  const toast = useToast()
  toast.add({
    title: 'Thông báo',
    description: 'Đường dẫn không hợp lệ',
    color: 'red',
    icon: 'i-bx-error',
    timeout: 2000
  })
}
</script>