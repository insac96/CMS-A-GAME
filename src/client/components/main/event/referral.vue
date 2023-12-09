<template>
  <div>
    <UTabs 
      v-model="tab" 
      :items="[
        { label: 'Mời bạn cùng chơi' },
        { label: 'Bằng hữu nạp tiền' },
      ]" 
      :ui="{wrapper: 'space-y-0'}"
      class="mb-2"
    />

    <div>
      <DataEventReferralPerson v-if="tab == 0" />
      <DataEventReferralWithdraw v-if="tab == 1" />
    </div>
  </div>
</template>

<script setup>
const tab = ref(0)
</script>

