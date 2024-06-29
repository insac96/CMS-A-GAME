<template>
  <UiContent 
    title="Send Item" 
    sub="Gửi vật phẩm cho người chơi" 
    class="max-w-4xl mx-auto"
  >
    <UForm @submit="submit" :validate="validate" :state="state">
      <UFormGroup label="Tiêu đề" name="title">
        <UInput v-model="state.title" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Nội dung" name="content">
        <UInput v-model="state.content" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Lý do" name="reason">
        <UTextarea v-model="state.reason" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="roles">
        <SelectGameRoles v-model="state.roles" />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="items">
        <SelectItemList v-model="state.items" :types="['game_item']" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-4">
        <UButton type="submit" :loading="!!loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal" preventClose :ui="{width: 'sm:max-w-[320px]'}">
      <UiFlex type="col" justify="center" class="p-4">
        <UiIcon :name="!!loading ? 'i-bx-mail-send' : 'i-bx-check'" size="24" color="primary" />
        <UiText align="center" class="mb-2" color="gray">{{ !!loading ? 'Vui lòng đợi tiến trình kết thúc' : 'Đã hoàn tất' }}</UiText>
        <UButton :loading="loading" @click="modal = false" :color="!!loading ? 'gray' : 'primary'">{{ !!loading ? 'Đang gửi' : 'Đóng' }}</UButton>
      </UiFlex>
    </UModal>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const loading = ref(false)
const modal = ref(false)
const process = ref(undefined)

const state = ref({
  title: 'Quà từ GM',
  content: 'Chúc bạn chơi game vui vẻ',
  reason: authStore.profile.type > 1 ? 'Dev Test' : null,
  roles: [],
  items: []
})

const validate = (state) => {
  const errors = []
  if(!state.reason) errors.push({ path: 'reason', message: 'Vui lòng nhập lý do' })
  if(state.roles.length < 1) errors.push({ path: 'roles', message: 'Vui lòng thêm nhân vật' })
  if(state.items.length < 1) errors.push({ path: 'items', message: 'Vui lòng thêm vật phẩm' })
  return errors
}

const submit = async () => {
  modal.value = true
  loading.value = true
  start()
}

const start = () => {
  if(state.value.roles.length == 0) {
    !!process.value && clearTimeout(process.value)
    process.value = null
    loading.value = false
    return
  }
  
  process.value = setTimeout(async () => {
    const userSend = state.value.roles[0]
    const sendInfo = {
      title: state.value.title,
      content : state.value.content,
      reason: state.value.reason,
      server: userSend.server.server_id,
      role: userSend.role.role_id,
      user: userSend.user._id,
      items: state.value.items
    }

    await useAPI('game/admin/send', JSON.parse(JSON.stringify(sendInfo)))
    state.value.roles.splice(0, 1)
    start()
  }, 2000)
}
</script>