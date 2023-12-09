<template>
  <div class="relative h-full min-h-full">
    <LayoutDefaultHeader />
    
    <UContainer class="grid grid-cols-12 gap-0 min-h-[calc(100%-var(--header-size)-var(--footer-size))]">
      <div :class="[
        'xl:col-span-2 md:col-span-3 col-span-12',
        'md:block hidden',
        'md:sticky md:top-[var(--header-size)]',
        'md:max-h-[calc(100vh-var(--header-size)-var(--footer-size))] md:overflow-y-auto',
        'py-4'
      ]">
        <LayoutDefaultNav />
      </div>
      
      <div class="xl:col-span-10 md:col-span-9 col-span-12 lg:pl-12 md:pl-8">
        <main class="py-4">
          <slot></slot>
        </main>
      </div>
    </UContainer>

    <DataEventReferralGiftbox />

    <LayoutFooter />
  </div>
</template>