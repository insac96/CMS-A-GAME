<template>
  <div class="relative h-full min-h-full">
    <LayoutDefaultHeader />
    
    <UContainer class="min-h-[calc(100%-var(--header-size)-var(--footer-size))] max-w-[800px] mx-auto">
        <main class="py-4">
          <slot></slot>
        </main>
    </UContainer>

    <LayoutFooter />
  </div>
</template>