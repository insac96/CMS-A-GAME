<template>
  <div>
    <UCard>
      <DataUserMini no-wheel no-notify no-diamond :reload="reload" v-if="!!authStore.isLogin" />

      <DataMinigameDiceBox :rolling="rolling" :dices="dices" class="mt-8 mb-10" />

      <UiFlex justify="center">
        <UButtonGroup>
          <UButton><UiText weight="semibold">Hũ</UiText></UButton>
          <UButton color="gray" class="px-4">
            {{jar < 100000000 ? toMoney(jar) : miniMoney(jar)}}
          </UButton>
        </UButtonGroup>

        <USelectMenu 
          v-if="!!authStore.isLogin"
          v-model="fastCoin" 
          :options="[10000, 100000, 1000000, 10000000, 100000000]"
          class="ml-auto"
        >
          <template #label>{{ miniMoney(fastCoin) }}</template>
          <template #option="{ option }">{{ miniMoney(option) }}</template>
        </USelectMenu>
      </UiFlex>

      <div class="grid grid-cols-12 gap-4 mt-4" v-if="!!authStore.isLogin">
        <UiFlex class="col-span-6" justify="center" v-for="i in 6" :key="i" >
          <UButtonGroup>
            <UButton class="p-0 text-4xl">
              <UiIcon :name="`i-bxs-dice-${i}`"/>
            </UButton>
            <UButton color="gray" icon="i-bx-minus" @click="minusFast(i)"></UButton>
            <UInput size="md" :model-value="miniMoney(state[`dice${i}`])" readonly disabled></UInput>
            <UButton color="gray" icon="i-bx-plus" @click="plusFast(i)"></UButton>
          </UButtonGroup>
        </UiFlex>
      </div>

      <UiFlex class="mt-4" v-if="!!authStore.isLogin">
        <UButton color="gray" class="mr-auto" @click="modal.limit = true">Giới hạn</UButton>

        <UButtonGroup v-if="coinPlay > 0" class="mr-1">
          <UButton icon="i-bxs-dollar-circle" ></UButton>
          <UButton color="gray" class="px-4">- {{ coinPlay < 100000000 ? toMoney(coinPlay) : miniMoney(coinPlay) }}</UButton>
        </UButtonGroup>

        <UButton 
          :color="coinPlay <= 0 ? 'gray' : 'primary'" 
          :disabled="coinPlay <= 0" 
          :loading="loading" 
          @click="start"
        >{{ !loading ? 'Chơi' : '' }}</UButton>
      </UiFlex>

      <UModal v-model="modal.limit" v-if="!!authStore.isLogin">
        <DataMinigameDiceLimit auth />
      </UModal>
    </UCard>

    <DataMinigameDiceLuckyUser class="mt-4" :reload="reload" />
    
    <DataMinigameDiceHistory class="mt-4" :reload="reload" v-if="!!authStore.isLogin && history" />
  </div>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !!val && getConfig())

const props = defineProps({
  history: { type: Boolean, default: true }
})

const modal = ref({
  limit: false
})

const loading = ref(false)
const reload = ref(0)
const rolling = ref(false)
const fastCoin = ref(10000)
const dices = ref([0,0,0])
const jar = ref(0)

const state = ref({
  dice1: null,
  dice2: null,
  dice3: null,
  dice4: null,
  dice5: null,
  dice6: null
})

const coinPlay = computed(() => {
  let coin = 0
  for (let i = 1; i < 7; i++){
    coin = coin + (state.value[`dice${i}`] || 0)
  }
  return coin
})

const minusFast = (i) => {
  state.value[`dice${i}`] = state.value[`dice${i}`] - fastCoin.value
  if(state.value[`dice${i}`] < 0) state.value[`dice${i}`] = 0
}

const plusFast = (i) => {
  state.value[`dice${i}`] = state.value[`dice${i}`] + fastCoin.value
}

const onRolling = (data) => {
  rolling.value = true

  setTimeout(() => {
    rolling.value = false
    setTimeout(() => {
      dices.value = data.dices
      jar.value = data.jar
      setTimeout(() => {
        reload.value++
        loading.value = false
      }, 1050)
    }, 50)
  }, 2000)
}

const start = async () => {
  try {
    loading.value = true
    const data = await useAPI('minigame/dice/rolling', JSON.parse(JSON.stringify(state.value)))
    onRolling(data)
  }
  catch (e) {
    loading.value = false
  }
}

const getConfig = async () => {
  const data = await useAPI('minigame/dice/get')
  jar.value = data.jar?.now || 0
}

getConfig()
</script>