import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const online = ref({
    guest: 0, member: 0, admin: 0
  })

  const setOnline = (data : { guest: number, member: number, admin: number }) => {
    online.value.guest = data.guest
    online.value.member = data.member
    online.value.admin = data.admin
  }

  return { online, setOnline }
})