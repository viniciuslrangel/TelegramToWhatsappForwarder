<template lang="pug">
  div
    h1 HOMEEE
    el-row(type="flex" justify="space-between")
      el-col(:span='10')
        h1.left Telegram
        el-card(v-for="phone in phoneList" :key="phone.id" shadow="hover")
          el-switch(:active-text="phone.title" @input="(value) => leftInput(value, phone)" :value="using[phone.id]")
      el-col(:span='10')
        h1.right Whatsapp
        div
          el-card(v-for="phone in wppPhoneList" :key="phone" shadow="hover")
            el-switch(:active-text="phone" @input="(value) => rightInput(value, phone)" :value="wppUsing[phone]")
</template>
<script>

import { ipcRenderer } from 'electron' // eslint-disable-line

export default {
  data() {
    return {
      using: {},
      wppUsing: {},
    }
  },
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
      return this.$store.state.Whatsapp.phoneList
    }
  },
  methods: {
    leftInput(value, phone) {
      const { id } = phone
      if (value) {
        this.$data.using[id] = true
      } else {
        delete this.$data.using[phone.id]
      }
      this.$data.using = Object.assign({}, this.$data.using)
      const { phoneList } = this
      this.$store.dispatch('Telegram/setActivePhones', phoneList.filter(e => this.$data.using[e.id]))
    },
    rightInput(value, phone) {
      if (value) {
        this.$data.wppUsing[phone] = true
      } else {
        delete this.$data.wppUsing[phone]
      }
      this.$data.wppUsing = Object.assign({}, this.$data.wppUsing)
      this.$store.dispatch('Whatsapp/setActive', this.$data.wppUsing)
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
