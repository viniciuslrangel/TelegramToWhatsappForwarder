<template lang="pug">
    h1 Conta do telegram
      el-input(v-model="phone" :disabled="!codeEnable" v-mask="['+## (##) ####-####', '+## (##) #####-####']" placeholder="+55 99 999999999")
      transition(name="fade" mode="out-in")
        el-button(@click="login" :disabled="phone.length < 8" v-if="codeEnable") Login
      el-input(v-model="code")
      // :disabled="codeEnable" placeholder='123456')
</template>

<script>

import { ipcRenderer } from 'electron' // eslint-disable-line

import { STATUS } from '../../main/telegram'

export default {
  data() {
    return {
      phone: '',
      code: ''
    }
  },
  computed: {
    codeEnable() {
      return this.$store.state.Telegram.state !== STATUS.WAITING_CODE
    },
  },
  methods: {
    login() {
      this.$store.dispatch('Telegram/registerPhone', { phone: this.phone })
    },
    sendCode() {
      this.$store.dispatch('Telegram/saveCode', { code: this.code })
    }
  },
  mounted() {
    this.$data.phone = this.$store.state.Telegram.phone || ''
  }
}
</script>

<style lang="scss" scoped>
</style>

