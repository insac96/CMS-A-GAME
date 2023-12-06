<template>
  <div>
    <USkeleton class="w-full h-80" v-if="loading"/>
    <div v-else>
      <DataEmpty icon="i-bx-credit-card" text="Không có thông tin" v-if="!payment"/>

      <UCard v-else>
        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold">Kênh</UiText>
          <UiText size="sm" weight="semibold">{{ payment.gate?.name || '...' }}</UiText>
        </UiFlex>

        <div v-if="payment.gate.type != 1">
          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold" mini>Số tài khoản</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ payment.gate?.number || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold" mini>Người hưởng thụ</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ payment.gate?.person || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold" mini>Số tiền</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ payment.money ? toMoney(payment.money) : '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between">
            <UiText size="sm" color="gray" weight="semibold" mini>Nội dung</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ payment.code || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="center" class="mt-12" v-if="payment.qrcode">
            <UiImg :src="payment.qrcode" class="w-[250px] md:max-w-[300px]"/>
          </UiFlex>
        </div>

        <div v-if="payment.gate.type == 1">
          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold">Nhà mạng</UiText>
            <UiText size="sm" weight="semibold">{{ payment.card?.net || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold">Số Seri</UiText>
            <UiText size="sm" weight="semibold">{{ payment.card?.seri || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-6">
            <UiText size="sm" color="gray" weight="semibold">Mã PIN</UiText>
            <UiText size="sm" weight="semibold">{{ payment.card?.pin || '...' }}</UiText>
          </UiFlex>

          <UiFlex justify="between">
            <UiText size="sm" color="gray" weight="semibold">Số tiền</UiText>
            <UiText size="sm" weight="semibold">{{ payment.money ? toMoney(payment.money) : '...' }}</UiText>
          </UiFlex>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const props = defineProps(['fetchId'])
const loading = ref(true)
const payment = ref(undefined)

const fetch = async () => {
  try {
    const data = await useAPI('payment/get', { _id: props.fetchId })
    loading.value = false
    payment.value = data
  }
  catch (e) {
    loading.value = false
  }
}

fetch()
</script>