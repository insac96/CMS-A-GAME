<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="
      LayoutPublicNav 
      hidden 2xl:block 
      border-r border-gray-100 dark:border-gray-800
      min-h-full h-full
      bg-white/75 dark:bg-gray-900 backdrop-blur-xl
      p-4
      overflow-y-auto
    ">
      <LayoutDefaultNav />
    </div>

    <div class="LayoutPublicMain relative">
      <LayoutDefaultHeader />
      
      <UContainer class="min-h-[calc(100%-var(--header-size)-var(--footer-size))] max-w-[800px] mx-auto">
        <main class="pb-6 pt-10">
          <slot></slot>
        </main>
      </UContainer>

      <LayoutFooter />
    </div>

    <div class="
      LayoutPublicChat 
      hidden 2xl:block 
      border-l border-gray-100 dark:border-gray-800
      min-h-full h-full
      bg-white/75 dark:bg-gray-900 backdrop-blur-xl
    ">
      <SocketChat :hidden-x="true" />
    </div>
  </div>
</template>

<style lang="sass">
.LayoutPublic
  @media (min-width: 1536px)
    display: grid
    grid-template-columns: var(--nav-size) 1fr var(--chat-size)
    grid-template-areas: "nav main chat"
  .LayoutPublicNav
    position: fixed
    top: 0
    left: 0
    grid-area: nav
    min-width: var(--nav-size)
    max-width: var(--nav-size)
    min-height: 100%
    max-height: 100%
  .LayoutPublicMain
    grid-area: main
  .LayoutPublicChat
    position: fixed
    top: 0
    right: 0
    grid-area: chat
    min-width: var(--chat-size)
    max-width: var(--chat-size)
    min-height: 100%
    max-height: 100%

  .fade-enter-active, .fade-leave-active
    transition: all 0.5s ease
  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>