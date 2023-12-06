<template>
  <UCard
    :ui="{ 
      base: 'relative transition-all ',
      rounded: 'rounded-xl',
      shadow: 'shadow-md hover:shadow-lg',
      header: { padding: 'p-0 sm:p-0' },
      footer: { padding: 'pt-0 sm:pt-0' },
      divide: '',
      ring: 'dark:ring-1 ring-0'
    }"
  > 
    <template #header>
      <div style="aspect-ratio: 4 / 2">
        <USkeleton class="w-full h-full rounded-none" />
      </div>
    </template>

    <USkeleton class="w-32 h-4 mb-2" />
    
    <USkeleton class="w-full h-16" />

    <template #footer>
      <UiFlex justify="between">
        <USkeleton class="w-24 h-4" />
        <USkeleton class="w-20 h-7" />
      </UiFlex>
    </template>
  </UCard>
</template>