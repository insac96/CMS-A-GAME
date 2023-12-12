<template>
  <UForm :validate="validate" :state="state" @submit="submit" class="p-6">
    <!-- User Info -->
    <UFormGroup name="currency">
      <DataUserMini v-model:currency="currency" no-wheel no-coin no-diamond />
    </UFormGroup>

    <!-- To -->
    <UFormGroup label="Gửi đến" name="to">
      <SelectUser v-model="state.to" multiple />
    </UFormGroup>

    <!-- Type -->
    <UFormGroup label="Loại" required name="type">
      <USelectMenu
        v-model="state.type"
        :options="typeSelectList"
        value-attribute="value"
        option-attribute="label"
        size="lg"
      >
        <template #label>{{ typeSelect ? typeSelect.label : 'Chọn loại thông báo' }}</template>
      </USelectMenu>
    </UFormGroup>

    <!-- Color -->
    <UFormGroup label="Màu sắc" name="color">
      <SelectColor v-model="state.color"/>
    </UFormGroup>

    <!-- Title -->
    <UFormGroup label="Tiêu đề" :hint="`${state.title ? state.title.length : 0}/20`" name="title">
      <UInput v-model="state.title" placeholder="Nhập tiêu đề ngắn hoặc để trống"/>
    </UFormGroup>

    <!-- Link -->
    <UFormGroup label="Đường dẫn" name="link" v-if="authStore.profile.type > 0">
      <UInput v-model="state.link" />
    </UFormGroup>

    <!-- Content -->
    <UFormGroup label="Nội dung" :hint="`${state.content ? state.content.length : 0}/200`" required name="content">
      <UTextarea v-model="state.content" autoresize name="input"/>
    </UFormGroup>

    <!-- Action -->
    <UiFlex class="mt-6">
      <SelectPin v-model="state.pin" />

      <UiFlex class="ml-auto">
        <UButton type="submit" :loading="loading" class="mr-1">Gửi</UButton>
        <UButton color="gray" @click="emit('done')" :disabled="loading">Đóng</UButton>
      </UiFlex>
    </UiFlex>
  </UForm>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['done'])

const loading = ref(false)

const currency = ref({
  notify: null
})

const state = ref({
  to: [],
  type: 0,
  color: 'gray',
  title: undefined,
  content: undefined,
  link: undefined,
  pin: 0
})

// Type Select
const typeSelectList = [
  { label: 'Mặc định', value: 0 },
  { label: 'Tin tức', value: 1, disabled: authStore.profile?.type < 1 },
  { label: 'Riêng tư', value: 2, disabled: authStore.profile?.type < 1 },
]
const typeSelect = computed(() => typeSelectList.find(i => i.value === state.value.type))

// Validate Form
const validate = (state) => {
  const errors = []
  if(!currency.value) errors.push({ path: 'currency', message: 'Không tìm thấy thông tin tài khoản' })
  else if (currency.value.notify < 1) errors.push({ path: 'currency', message: 'Bạn đã hết lượt gửi thông báo' })
  if (state.to.length == 0 && authStore.profile?.type < 1) errors.push({ path: 'to', message: 'Vui lòng chọn người nhận' })
  if (state.type == undefined) errors.push({ path: 'type', message: 'Vui lòng chọn một loại' })
  if (!!state.title && state.title.length > 20) errors.push({ path: 'title', message: 'Tiêu đề từ 1-20 ký tự' })
  if (!state.content) errors.push({ path: 'content', message: 'Vui lòng nhập đầy đủ' })
  else if (state.content.length > 200) errors.push({ path: 'content', message: 'Nội dung tối đa 200 ký tự' })
  return errors
}

// Submit
const submit = async () => {
  try {
    loading.value = true
    await useAPI('notify/user/send', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    emit('done')
  }
  catch(e){
    loading.value = false
  }
}
</script>