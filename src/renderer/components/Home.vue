<template lang="pug">
  .parent
    .split
      el-container
        el-header.header Telegram
        el-main
          el-form
            el-form-item
              el-switch.switch(:value="enableAll" @input="(value) => changeEnableAll(value)")
              span.switch-label Selecionar Todos

          el-card.card(v-for="phone in phoneList" :key="phone.id" shadow="hover")
            el-switch(:active-text="phone.title" @input="(value) => leftInput(value, phone)" :disabled="enableAll" :value="activeList.findIndex(e => e.id == phone.id) !== -1")

    .split
      el-container
        el-header.header Whatsapp
        el-main
          el-card.card(v-for="phone in wppPhoneList" :key="phone" shadow="hover")
            el-switch.text(:active-text="phone" @input="(value) => rightInput(value, phone)" :value="wppActiveList.indexOf(phone) !== -1")
</template>

<script>

import { ipcRenderer } from 'electron' // eslint-disable-line
import { mapState } from 'vuex'

export default {
  computed: {
    phoneList() {
      const { phoneList, activeList } = this.$store.state.Telegram
      return phoneList.concat(activeList)
        .filter((e, i, arr) => arr.findIndex(e2 => e.id === e2.id) === i)
        .sort((a, b) => {
          const aI = activeList.indexOf(a)
          const bI = activeList.indexOf(b)
          if (aI !== -1 && bI === -1) {
            return -1
          }
          if (aI === -1 && bI !== -1) {
            return 1
          }
          return 0
        })
    },
    wppPhoneList() {
      const { phoneList, activeList } = this.$store.state.Whatsapp
      return activeList.concat(phoneList)
        .filter((e, i, arr) => arr.lastIndexOf(e) === i)
    },
    ...mapState('Telegram', ['activeList', 'enableAll']),
    ...mapState('Whatsapp', {
      wppActiveList: 'activeList',
      errList: 'errList'
    })
  },
  methods: {
    leftInput(value, phone) {
      let using = this.activeList.slice(0)
      if (value) {
        using.push(phone)
      } else {
        using = using.filter(e => e.id !== phone.id)
      }
      this.$store.dispatch('Telegram/setActivePhones', using)
    },
    rightInput(value, phone) {
      let using = this.wppActiveList.slice(0)
      if (value) {
        using.push(phone)
      } else {
        using = using.filter(e => e !== phone)
      }
      this.$store.dispatch('Whatsapp/setActive', using)
    },
    changeEnableAll(value) {
      this.$store.dispatch('Telegram/setActivePhones', value)
    },
    refreshWpp() {
      ipcRenderer.send('Whatsapp/LIST_USERS')
    },
    receiveWpp(event, users) {
      this.$data.wppUsers = users
    }
  },
  mounted() {
    this.refreshWpp()
  }
}
</script>

<style lang="sass">
  $border-size: 8px

  .parent
    display: flex

  .split
    width: calc(50vw - #{$border-size * 2} - .5px)

    &:first-child
      border-right: $border-size #003d33 solid
    &:last-child
      border-left: $border-size #003d33 solid

    .card
      border: none
      background-color: #33685c
      color: #fff
      margin-bottom: .5em

      span
        color: #fff !important
        font-size: 14px

  .el-switch__core
    background-color: transparent

  .header
    background-color: #003d33
    color: #ffffff
    text-align: center
    line-height: 60px
    font-family: 'Righteous', cursive
    font-size: 1.7em

  .switch
    padding-right: 10px

  .switch-label
    color: #fff

  .left
    text-align: left

  .right
    text-align: right

</style>
