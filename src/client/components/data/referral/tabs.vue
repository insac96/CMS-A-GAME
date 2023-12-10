<template>
  <div>
    <UTabs 
      v-model="tab" 
      :items="[
        { label: 'Mời bạn cùng chơi' },
        { label: 'Rút tiền mặt' },
        { label: 'Quà từ người giới thiệu' },
      ]" 
      :ui="{ wrapper: 'space-y-0' }"
      class="mb-2"
    />

    <MainEventReferral v-if="tab == 0" />
    <MainActionWithdraw v-if="tab == 1" class="p-2" />
    <DataReferralGiftInvited v-if="tab == 2" class="p-2" />
  </div>
</template>

<script setup>
const tab = ref(0)
</script>

