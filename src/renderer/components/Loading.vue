<template lang="pug">
    h1 THIS IS THE LOADING PAGE
</template>

<script>
import { ipcRenderer } from 'electron' // eslint-disable-line
// import { STATUS } from '../../main/telegram'

export default {
  mounted() {
    ipcRenderer.send('Telegram/CREATE')
  }
}
</script>
