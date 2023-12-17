<template>
  <UCard>
    <UForm :validate="validate" :state="state" @submit="submit">
      <UFormGroup label="Tài khoản" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>

    <!-- <template #footer>
      <UiFlex justify="center" class="gap-3">
        <LazyAuthSignSocialFacebook />
        <LazyAuthSignSocialGoogle />
        <LazyAuthSignSocialZalo />
        <LazyAuthSignSocialTiktok />
      </UiFlex>
    </template> -->
  </UCard>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const emit = defineEmits(['done'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const submit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true

    await useAPI('auth/sign/in', JSON.parse(JSON.stringify(state.value)))

    const auth = await useAPI('auth/get')
    authStore.setAuth(auth)
    $socket.emit('login', authStore.profile._id)

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>