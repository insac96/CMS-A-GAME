<template>
  <UiFlex :items="!configStore.config.logo_long_image ? 'end' : 'center'">
    <svg class="w-auto md:h-9 h-6" width="264" height="264" viewBox="0 0 264 264" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="!configStore.config.logo_long_image">
      <path d="M146.496 211.2H234.822C237.627 211.2 240.383 210.468 242.813 209.078C245.242 207.688 247.259 205.688 248.662 203.279C250.064 200.871 250.801 198.139 250.8 195.359C250.799 192.579 250.059 189.847 248.655 187.44L189.337 85.612C187.935 83.2043 185.918 81.2049 183.489 79.8147C181.06 78.4246 178.305 77.6927 175.5 77.6927C172.695 77.6927 169.94 78.4246 167.511 79.8147C165.082 81.2049 163.065 83.2043 161.663 85.612L146.496 111.666L116.841 60.7179C115.438 58.3104 113.42 56.3113 110.991 54.9214C108.561 53.5315 105.805 52.7998 103 52.7998C100.195 52.7998 97.4386 53.5315 95.0089 54.9214C92.5793 56.3113 90.5615 58.3104 89.1583 60.7179L15.3453 187.44C13.9411 189.847 13.2012 192.579 13.2 195.359C13.1987 198.139 13.9363 200.871 15.3384 203.279C16.7405 205.688 18.7578 207.688 21.1873 209.078C23.6168 210.468 26.3728 211.2 29.1783 211.2H84.6219C106.589 211.2 122.789 201.636 133.937 182.979L161 136.526L175.496 111.666L219 186.34H161L146.496 211.2ZM83.7181 186.314L45.0255 186.306L103.026 86.7466L131.966 136.526L112.589 169.798C105.186 181.904 96.7763 186.314 83.7181 186.314Z" fill="rgb(var(--color-primary-DEFAULT))" />
    </svg>
    <img v-else :src="useMakeLink().imgLink(configStore.config.logo_long_image)" class="w-auto h-[calc(var(--header-size)*0.6)] mr-2">

    <UiText class="md:text-lg text-sm" weight="bold" v-if="!configStore.config.logo_long_image">{{ text[0] }}</UiText>
    <UiText class="md:text-lg text-sm" weight="bold" color="primary" v-if="!configStore.config.logo_long_image">{{ text[1] }}</UiText>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const text = computed(() => {
  const name = configStore.config.short_name || 'Web'
  if(name.length < 3) return [name, '']
  const start = name.substring(0, name.length - 2)
  const end = name.substring(name.length - 2)
  return [ start, end ]
})
</script>