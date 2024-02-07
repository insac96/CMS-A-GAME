<template>
    <UiFlex class="w-full h-full p-4" justify="center">
        <UiFlex class="w-[400px] max-w-[100%]" justify="center" type="col" v-if="!authStore.isLogin">
            <UiText weight="bold" align="center" color="primary" size="xl" class="mb-4 px-4">Xác Thực Tài Khoản Tham Gia CloseBeta</UiText>
            <AuthSignIn class="w-full" @done="play"></AuthSignIn>
        </UiFlex>

        <UiFlex type="col" justify="center" class="h-full" v-else>
            <UiIcon name="i-bxs-wink-smile" class="mb-4" size="24" color="primary" />
            <UiText color="primary" weight="bold" size="4xl" class="mb-4 px-2">Xin chào, {{ authStore.profile.username }}</UiText>
            <UiText class="mb-4 px-6" align="center">Đây là phiên bản CloseBeta giới hạn cho một số người nhất đinh, vui lòng đợi trong giây lát</UiText>
            <UiIcon color="primary" name="i-bx-loader-alt" class="animate-spin mb-1" size="5" />
            <UiText color="gray" size="sm">Đang xác thực...</UiText>
        </UiFlex>
    </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: false
})

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()
const { navigateToSSL } = useTo()

watch(() => authStore.isLogin, (val) => {
    if(!!val) return play()
})

const play = async () => {
    try {
        await useAPI('game/closebeta')
        setTimeout(() => {
            if(!!runtimeConfig.public.dev) navigateTo('/closebeta/play')
            else location.href = `http://game.${runtimeConfig.public.domain}/closebeta/play`
        }, 1000)
    }
    catch (e){
        setTimeout(() => navigateToSSL('/'), 1000)
    }
}

const init = () => {
    if(!!authStore.isLogin) return play()
}
init()
</script>