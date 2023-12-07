<template>
  <UiContent 
    title="Send Item" 
    sub="Gửi vật phẩm cho người chơi" 
    class="max-w-4xl mx-auto"
  >
    <UForm @submit="submit" :validate="validate" :state="state">
      <UFormGroup label="Tài khoản" name="user">
        <SelectUser v-model="state.user" />
      </UFormGroup>
      
      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server && !!state.user">
        <SelectGameRole v-model="state.role" :server="state.server" :user="state.user" />
      </UFormGroup>

      <UFormGroup label="Tiêu đề" name="title">
        <UInput v-model="state.title" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Nội dung" name="content">
        <UInput v-model="state.content" placeholder="Có thể để trống" />
      </UFormGroup>

      <UFormGroup label="Lý do" name="reason">
        <UTextarea v-model="state.reason" />
      </UFormGroup>

      <UFormGroup name="items">
        <SelectItemList v-model="state.items" :types="['game_item']" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading" class="mr-1">Gửi</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const loading = ref(false)

const state = ref({
  user: null,
  server: null,
  role: null,
  title: null,
  content: null,
  reason: null,
  items: []
})

const validate = (state) => {
  const errors = []
  if(!state.user) errors.push({ path: 'user', message: 'Vui lòng chọn tài khoản' })
  if(!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if(!!state.server && !state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if(!state.reason) errors.push({ path: 'reason', message: 'Vui lòng nhập lý do' })
  if(state.items.length < 1) errors.push({ path: 'items', message: 'Vui lòng thêm vật phẩm' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/admin/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}
</script>