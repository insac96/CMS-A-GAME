<template>
  <div>
    <USkeleton class="w-full h-80" v-if="loading"/>
    <div v-else>
      <DataEmpty icon="i-bx-money-withdraw" text="Không có thông tin" v-if="!withdraw"/>

      <UCard v-else>
        <UiFlex justify="between" class="mb-6">
          <UiText size="sm" color="gray" weight="semibold">Mã giao dịch</UiText>
          <UiText size="sm" weight="semibold">{{ withdraw.code || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between">
          <UiText size="sm" color="gray" weight="semibold" mini>Số cống hiến</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-4">{{ withdraw.diamond ? toMoney(withdraw.diamond) : '...' }}</UiText>
        </UiFlex>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { toMoney } = useMoney()
const props = defineProps(['fetchId'])
const loading = ref(true)
const withdraw = ref(undefined)

const fetch = async () => {
  try {
    const data = await useAPI('withdraw/get', { 
      _id: props.fetchId,
      secret: route.params._secret
    })
    loading.value = false
    withdraw.value = data
  }
  catch (e) {
    loading.value = false
  }
}

fetch()
</script>