<template>
  <div>
    <!-- Form -->
    <UForm :state="state" :validate="validate" @submit="submit">
      <UFormGroup>
        <DataUserMini v-model:level="level" v-model:currency="currency" no-wheel no-notify />
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhập số lượng" name="amount" v-if="!!item">
        <UInput v-model="state.amount" :disabled="item.type == 'game_recharge'" type="number" />
      </UFormGroup>

      <UFormGroup label="Thông tin đơn hàng" name="info" v-if="!!item && !!level && !!currency">
        <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6"> Mặt hàng</UiText>
            <UiText align="right">{{ item.name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Đơn giá</UiText>
            <UiText align="right">{{ toMoney(item.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Số lượng</UiText>
            <UiText align="right">x{{ state.amount }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Giảm giá</UiText>
            <UiText align="right">{{ `${level.discount}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="!!totalPrice">
            <UiText color="gray" class="mr-6">Thành tiền</UiText>
            <UiText color="primary" weight="bold" align="right">{{ `${toMoney(totalPrice)} Xu` }}</UiText>
          </UiFlex>
        </UCard>
      </UFormGroup>

      <UiFlex class="mt-6">
        <UButton color="gray" class="mr-auto" @click="modal = true">Xem giới hạn</UButton>
        <UButton type="submit" :loading="loading" class="mr-1" v-if="!!isActive">Mua</UButton>
        <UButton color="gray" :disabled="loading" @click="emit('close')">Đóng</UButton>
      </UiFlex>
    </UForm>

    <!-- Limit -->
    <UModal v-model="modal">
      <DataShopLimit auth />
    </UModal>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const props = defineProps(['item', 'server'])
const emit = defineEmits(['close'])

const loading = ref(false)
const modal = ref(false)

const level = ref(undefined)
const currency = ref({ coin: null })

const state = ref({
  server: props.server ? props.server : null,
  role: null,
  item: props.item ? props.item._id : null,
  amount: 1
})

const totalPrice = computed(() => {
  const amount = state.value.amount
  const price = props.item ? props.item?.price : 0
  const discount = level.value ? level.value.discount : 0

  if(!amount || amount < 1) return null
  if(!price || price < 1) return null
  if(discount === undefined || discount < 0) return null

  let total = Math.floor(amount * price)
  total = total - Math.floor(total * discount / 100)
  return total
})

const isActive = computed(() => {
  if(!level.value) return false
  if(!currency.value) return false
  return true
})

const validate = (state) => {
  const errors = []
  if (!totalPrice.value) errors.push({ path: 'info', message: 'Không thể lấy thông tin giá tiền' })
  else if (!!totalPrice.value && currency.value.coin < totalPrice.value) errors.push({ path: 'info', message: 'Số dư xu không đủ' })
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if (!state.amount) errors.push({ path: 'amount', message: 'Vui lòng nhập số lượng' })
  else if (state.amount < 1) errors.push({ path: 'amount', message: 'Số lượng không hợp lệ' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('shop/buyItem', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emit('close')
  }
  catch (e) {
    loading.value = false
  }
}
</script>