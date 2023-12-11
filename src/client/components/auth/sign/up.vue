<template>
  <UCard>
    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Tài khoản" :hint="`${state.username ? state.username.length : 0}/15`" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Hòm thư" name="email">
        <UInput icon="i-bxs-envelope" v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Điện thoại" name="phone">
        <UInput icon="i-bxs-phone" v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup label="Mã mời" name="referral_code">
        <UInput icon="i-bx-barcode" v-model="state.referral_code" placeholder="Nhập mã mời nếu có" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading.signup">Xác Nhận</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal.referral" prevent-close>
      <UCard>
        <UAlert
          icon="i-heroicons-command-line"
          color="primary"
          variant="subtle"
          title="Đăng Ký Thành Công"
          class="mb-4"
        >
          <template #description>
            <UiText class="mb-1">- Hãy sử dụng mã mời để giới thiệu bạn bè cùng tham gia.</UiText>
            <UiText class="mb-1">- Bạn sẽ nhận được Điểm Cống Hiến mỗi khi bạn bè của bạn nạp tiền thành công.</UiText>
            <UiText>- Sử dụng điểm cống hiến có thể rút tiền về tài khoản ngân hàng của bạn.</UiText>
          </template>
        </UAlert>

        <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
          <UiFlex class="mr-6">
            <UiIcon name="i-bx-user" size="5" class="mr-2" />
            <UiText weight="semibold" size="sm">Tài khoản</UiText>
          </UiFlex>
          
          <UiText size="sm" weight="bold" color="primary">{{ state.username }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
          <UiFlex class="mr-6">
            <UiIcon name="i-bx-envelope" size="5" class="mr-2" />
            <UiText weight="semibold" size="sm">Email</UiText>
          </UiFlex>
          
          <UiText size="sm" weight="bold" color="primary">{{ state.email }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
          <UiFlex class="mr-6">
            <UiIcon name="i-bx-phone" size="5" class="mr-2" />
            <UiText weight="semibold" size="sm">Điện thoại</UiText>
          </UiFlex>
          
          <UiText size="sm" weight="bold" color="primary">{{ state.phone }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
          <UiFlex class="mr-6">
            <UiIcon name="i-bx-barcode" size="5" class="mr-2" />
            <UiText weight="semibold" size="sm">Mã mời của bạn</UiText>
          </UiFlex>
          
          <UiText size="sm" weight="bold" color="primary">{{ `CVV-${state.username.toUpperCase()}` }}</UiText>
        </UiFlex>

        <UiFlex justify="end" class="mt-4">
          <UButton color="gray" :loading="loading.start" @click="start">Đóng</UButton>
        </UiFlex>
      </UCard>
    </UModal>
  </UCard>
</template>

<script setup>
const { setAuth } = useAuthStore()
const emit = defineEmits(['done'])

const loading = ref({
  signup: false,
  start: false
})

const modal = ref({
  referral: false
})

const state = ref({
  username: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
  referral_code: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  else if (state.username.length < 6 || state.username.length > 15) errors.push({ path: 'username', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.username.match(/\s/g)) errors.push({ path: 'username', message: 'Phát hiện khoảng cách' })
  else if (!(/^[a-z0-9]*$/g).test(state.username)) errors.push({ path: 'username', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
  else if (!!state.username.includes('admin')
    || !!state.username.includes('smod')
    || !!state.username.includes('robot')
  ) errors.push({ path: 'username', message: 'Danh xưng không hợp lệ' })

  if (!state.email) errors.push({ path: 'email', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng không đúng' })

  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng không đúng' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

  return errors
}

const submit = async () => {
  try {
    loading.value.signup = true
    await useAPI('auth/sign/up', JSON.parse(JSON.stringify(state.value)))

    modal.value.referral = true
    loading.value.signup = false
  }
  catch (e) {
    loading.value.signup = false
  }
}

const start = async () => {
  try {
    loading.value.start = true
    const auth = await useAPI('auth/get')
    setAuth(auth)

    loading.value.start = false
    modal.value.referral = false
    emit('done')
  }
  catch(e){
    loading.value.start = false
  }
}
</script>