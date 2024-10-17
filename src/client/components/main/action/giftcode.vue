<template>
  <div>
    <DataEmpty text="Vui lòng đăng nhập trước" icon="i-bx-barcode-reader" v-if="!authStore.isLogin" />

    <div v-else>
      <UForm :validate="validate" :state="state" @submit="submit">
        <UFormGroup name="code" label="Nhập mã">
          <UInput v-model="state.code" />
        </UFormGroup>

        <UFormGroup>
          <UiFlex justify="between">
            <UButton color="gray" @click="modal.history = true">Lịch sử</UButton>
            <UButton type="submit" :loading="loading">Kiểm tra</UButton>
          </UiFlex>
        </UFormGroup>

        <UFormGroup name="public" label="Mã công khai" v-show="!!giftcodes">
          <DataGiftcodePublic v-model:giftcodes="giftcodes" />
        </UFormGroup>
      </UForm>

      <UModal v-model="modal.receive" prevent-close>
        <DataGiftcodeReceive :giftcode="giftcode" @done="doneReceive" @close="modal.receive = false" class="p-4" />
      </UModal>

      <UModal v-model="modal.history">
        <DataGiftcodeHistory/>
      </UModal>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const loading = ref(false)

const modal = ref({
  receive: false,
  history: false
})

const giftcodes = ref(undefined)
const giftcode = ref(undefined)

const state = ref({
  code: null
})

watch(() => modal.value.receive, (val) => !val && (giftcode.value = undefined))

const doneReceive = () => {
  modal.value.receive = false
  state.value.code = null
}

const validate = (state) => {
  const errors = []
  if(!state.code) errors.push({ path: 'code', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    const post = JSON.parse(JSON.stringify(state.value))
    const data = await useAPI('giftcode/get', {
      code: post.code
    })

    giftcode.value = data
    loading.value = false
    modal.value.receive = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>