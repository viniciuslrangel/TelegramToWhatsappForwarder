<template lang="pug">
    h1 THIS IS THE LOADING PAGE
</template>

<script>
import { ipcRenderer } from 'electron' // eslint-disable-line
import { STATUS } from '../../main/telegram'

export default {
  created() {
    ipcRenderer.send('Telegram/CREATE')
    if (this.$store.state.Telegram.state !== STATUS.LOGIN_SUCCESS) {
      return
    }
    ipcRenderer.send('Whatsapp/CREATE')
  }
}
</script>
