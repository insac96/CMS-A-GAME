<template>
  <div>
    <DataEmpty text="Vui lòng đăng nhập trước" icon="i-bx-gift" v-if="!authStore.isLogin" />

    <div v-else>
      <DataEmpty 
        v-if="!gift || !!loading.gift"
        :text="!!loading.gift ? 'Đang tải...' : 'Không có thông tin'" 
        icon="i-bx-gift" 
      />

      <UForm v-if="!!gift" :state="state" @submit="receive">
        <UFormGroup label="Gói quà">
          <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
            <DataItemList :items="gift" class="justify-center"/>
          </UCard>
        </UFormGroup>

        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" v-if="!!state.server" >
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="receive" :loading="loading.receive" class="mr-1">Nhận</UButton>
        </UiFlex>
      </UForm>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const loading = ref({
  gift: true,
  receive: false
})

const gift = ref(undefined)

const state = ref({
  server: null,
  role: null,
})

const receive = async () => {
  try {
    loading.value.receive = true
    await useAPI('referral/receiveGiftInvited', JSON.parse(JSON.stringify(state.value)))

    loading.value.receive = false
  }
  catch (e) {
    loading.value.receive = false
  }
}

const getGift = async () => {
  try {
    if(!authStore.isLogin) return
    const data = await useAPI('referral/getGiftInvited')

    gift.value = data
    loading.value.gift = false
  }
  catch (e) {
    gift.value = undefined
    loading.value.gift = false
  }
}

getGift()
</script>