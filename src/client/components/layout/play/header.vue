<template>
  <header class="w-full bg-white/75 dark:bg-transparent backdrop-blur-xl">
    <UiFlex class="w-full h-[50px] max-h-[50px] px-2">
      <LayoutPlayMenu class="w-1/3" />

      <UiFlex class="w-1/3 justify-center">
        <NuxtLink to="/">
          <UiLogo />
        </NuxtLink>
      </UiFlex>

      <UiFlex justify="end" items="center" class="w-1/3">
        <Setting />
        <AuthSlide />
      </UiFlex>
    </UiFlex>
  </header>
</template>