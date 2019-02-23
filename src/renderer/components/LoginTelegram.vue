<template lang="pug">
    h1 Conta do telegram
      div(v-if="this.state == this.STATUS.WAITING_LOGIN")
        h3 Phone
        el-input(v-model="phone" v-mask="['+## (##) ####-####', '+## (##) #####-####']" placeholder="+55 99 999999999")
        el-button(@click="login" :disabled="phone.length < 8") Login
      div(v-if="this.state == this.STATUS.WAITING_CODE")
        h3 Code
        el-input(v-model="code" :disabled="codeEnable" placeholder="123456" maxlength="5")
        el-button(@click="sendCode" :disabled="this.code.length != 5")
      div(v-if="this.state == this.STATUS.WAITING_PASSWD")
        h3 Password
        el-input(v-model="password" type="password")
        el-button(@click="sendPasswd" :disabled="this.password.length < 2")
        span {{ (this.additional || {}).hint || '' }}
        span(style="color: red;" v-if="(this.additional || {}).retry === true") Try again
</template>

<script>

import { ipcRenderer } from 'electron' // eslint-disable-line
import { mapState } from 'vuex'
import { STATUS } from '../../main/telegram'

export default {
  data() {
    return {
      phone: '',
      code: '',
      password: '',
      STATUS
    }
  },
  computed: {
    codeEnable() {
      return this.$store.state.Telegram.state !== STATUS.WAITING_CODE
    },
    ...mapState('Telegram', ['state', 'additional'])
  },
  methods: {
    login() {
      this.$store.dispatch('Telegram/registerPhone', { phone: this.phone })
    },
    sendCode() {
      ipcRenderer.send('Telegram/CODE', this.code)
    },
    sendPasswd() {
      this.$store.dispatch('Telegram/clearAdditional')
      ipcRenderer.send('Telegram/PASSWD', this.password)
    }
  },
  mounted() {
    this.$data.phone = this.$store.state.Telegram.phone || ''
  }
}
</script>

<style lang="scss" scoped>
</style>

