import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const url : any = ref(null)

  const setURL = (data : string) => {
    url.value = data
  }

  return { url, setURL }
})