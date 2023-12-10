<template>
  <div>
    <DataEmpty text="Vui lòng đăng nhập trước" icon="i-bx-money-withdraw" v-if="!authStore.isLogin" />

    <div v-else>
      <UAlert
        title="Hướng Dẫn"
        description="Bạn có thể nhận được điểm cống hiến từ các giao dịch nạp tiền thành công của bạn bè mà bạn giới thiệu. Sau đó bạn có thể dùng điểm cống hiến để rút tiền về tài khoản !"
        color="primary"
        variant="subtle"
        class="mb-6"
      />

      <UForm :state="state" :validate="validate" @submit="submit">
        <UFormGroup name="user">
          <DataUserMini no-coin no-notify no-wheel v-model:currency="currency" />
        </UFormGroup>

        <UFormGroup label="Ngân hàng" name="bank_name">
          <UInput v-model="state.bank.name" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản" name="bank_number">
          <UInput v-model="state.bank.number" />
        </UFormGroup>

        <UFormGroup label="Người hưởng thụ" name="bank_person">
          <UInput v-model="state.bank.person" />
        </UFormGroup>

        <UFormGroup label="Số tiền rút" name="diamond">
          <UInput v-model="state.diamond" type="number" />
        </UFormGroup>

        <UiFlex justify="between" class="mt-4">
          <UButton color="gray" @click="modal.history = true">Lịch sử</UButton>
          <UButton type="submit" :loading="loading">Tạo Giao Dịch</UButton>
        </UiFlex>
      </UForm>
    </div>

    <UModal v-model="modal.withdraw" prevent-close>
      <DataWithdrawView :fetch-id="withdraw" class="p-4"/>

      <UiFlex justify="end" class="px-4 pb-4">
        <UButton color="gray" @click="modal.withdraw = false">Đóng</UButton>
      </UiFlex>
    </UModal>

    <UModal v-model="modal.history" :ui="{ width: 'lg:max-w-4xl md:max-w-2xl sm:max-w-xl' }">
      <DataWithdrawHistory />
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const withdraw = ref(undefined)

const loading = ref(false)

const modal = ref({
  withdraw: false,
  history: false,
})

const currency = ref({
  diamond: 0
})

const state = ref({
  bank: {
    name: null,
    person: null,
    number: null
  },
  diamond: null
})

watch(() => modal.value.withdraw, (val) => {
  if(!!val) return
  withdraw.value = undefined
  state.value.bank = {
    name: null,
    person: null,
    number: null
  }
  state.value.diamond = null
})

const validate = (state) => {
  const errors = []
  if (!state.bank.name) errors.push({ path: 'bank_name', message: 'Vui lòng nhập đầy đủ' })
  if (!state.bank.person) errors.push({ path: 'bank_person', message: 'Vui lòng nhập đầy đủ' })
  if (!state.bank.number) errors.push({ path: 'bank_number', message: 'Vui lòng nhập đầy đủ' })
  if (state.diamond <= 0) errors.push({ path: 'diamond', message: 'Số tiền không hợp lệ' })
  if (currency.value.diamond < state.diamond) errors.push({ path: 'user', message: 'Số dư cống hiến không đủ' }) 
  return errors
}

// Submit
const submit = async () => {
  try {
    loading.value = true
    const data = await useAPI('withdraw/create', JSON.parse(JSON.stringify(state.value)))

    withdraw.value = data
    modal.value.withdraw = true
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>