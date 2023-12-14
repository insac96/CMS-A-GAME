import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const online = ref(0)

  const setOnline = (data : number) => {
    online.value = data
  }

  return { online, setOnline }
})