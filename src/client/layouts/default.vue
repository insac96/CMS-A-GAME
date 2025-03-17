<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="LayoutPublicMain relative">
      <LayoutDefaultHeader />
      
      <UContainer class="min-h-[calc(100%-var(--header-size)-var(--footer-size))] max-w-[800px] mx-auto py-4">
        <main>
          <slot></slot>
        </main>
      </UContainer>

      <div class="h-[100px]"></div>
      <!-- <LayoutFooter /> -->
    </div>

    <LayoutDefaultMenu class="lg:hidden" />
  </div>
</template>

<style lang="sass">
.LayoutPublic
  @media (min-width: 1536px)
    display: grid
    grid-template-columns: 1fr
    grid-template-areas: "main"
  .LayoutPublicMain
    grid-area: main

  .fade-enter-active, .fade-leave-active
    transition: all 0.5s ease
  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>