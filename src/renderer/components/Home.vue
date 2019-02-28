<template lang="pug">
  div
    h1 HOMEEE
    el-row(v-if="errList.length > 0")
      h4 Não foi possivel enviar a ultima mensagem para:
      .list-item(v-for="name in errList" :key="name")
      | {{ name }}
    el-row(type="flex" justify="space-between")
      el-col(:span='10')
        h1.left Telegram
        el-card(v-for="phone in phoneList" :key="phone.id" shadow="hover")
          el-switch(:active-text="phone.title" @input="(value) => leftInput(value, phone)" :value="activeList.findIndex(e => e.id == phone.id) !== -1")
      el-col(:span='10')
        h1.right Whatsapp
        div
          el-card(v-for="phone in wppPhoneList" :key="phone" shadow="hover")
            el-switch(:active-text="phone" @input="(value) => rightInput(value, phone)" :value="wppActiveList.indexOf(phone) !== -1")
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
    ...mapState('Telegram', ['activeList']),
    ...mapState('Whatsapp', {
      wppActiveList: 'activeList',
      wppPhoneList: 'phoneList',
      errList: 'errList'
    })
  },
  methods: {
    leftInput(value, phone) {
      let using = this.$store.state.Telegram.activeList.slice(0)
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

<style lang="scss" scoped>

.left {
  text-align: left;
}

.right {
  text-align: right
}

</style>
