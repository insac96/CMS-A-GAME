export const useTo = () => {
  const navigateToSSL = (path : string) => {
    const runtimeConfig = useRuntimeConfig()

    if(!!runtimeConfig.dev) return navigateTo(path)

    if(process.client){
      if (window.location.protocol == "https:") {
        navigateTo(path)
      }
      else {
        location.href = `https://${runtimeConfig.public.domain}${path}`
      }
    }
    
    if(process.server){
      navigateTo(path)
    }
  }

  return { navigateToSSL }
}