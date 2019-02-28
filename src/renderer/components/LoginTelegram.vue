<template lang="pug">
  el-container
    el-header.header Conta do Telegram

    el-main
      el-card.card
        el-form(@submit.native.prevent)
          el-form-item
            span.item(slot="label") Phone Number
            el-input(v-model="phone" v-on:keyup.enter.native="login" :disabled="this.state > this.STATUS.WAITING_LOGIN" v-mask="['+## (##) ####-####', '+## (##) #####-####']" placeholder="+55 99 999999999")
              el-button(slot="append" @click="login" :disabled="phone.length < 8 || this.state > this.STATUS.WAITING_LOGIN") Login

      el-collapse-transition
        el-card.card(body-style={padding: "0 20px"} v-if="this.state >= this.STATUS.WAITING_CODE")
          el-form
            el-form-item
              span.item(slot="label") Code
              el-input(v-model="code" v-on:keyup.enter.native="sendCode" :disabled="this.state > this.STATUS.WAITING_CODE" placeholder="123456" maxlength="5")
                el-button(slot="append" @click="sendCode" :disabled="this.code.length !== 5 || this.state > this.STATUS.WAITING_CODE") Continue

      el-collapse-transition
        el-card.card(v-if="this.state >= this.STATUS.WAITING_PASSWD")
          el-form
            el-form-item
              span.item(slot="label") Password
              el-input(v-model="password" v-on:keyup.enter.native="sendPasswd" type="password" placeholder="••••••")
                el-button(slot="append" @click="sendPasswd" :disabled="this.password.length < 2") Continue
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

<style lang="sass" scoped>
  .header
    background-color: #003d33
    color: #ffffff
    text-align: center
    line-height: 60px
    font-family: 'Righteous', cursive
    font-size: 1.7em

  .card
    background-color: #39796b
    border-color: #00251a
    margin: auto auto 2em

    @media screen and (min-width: 600px)
      max-width: 75vw

    @media screen and (min-width: 1000px)
      max-width: 50vw

    @media screen and (min-width: 1600px)
      max-width: 25vw

    .item
      color: white

    .el-form-item__label
      color: white !important

</style>

