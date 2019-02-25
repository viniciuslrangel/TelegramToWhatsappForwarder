<template lang="pug">
  el-container
    .center(v-loading="true")
</template>

<script>
	import {ipcRenderer} from 'electron' // eslint-disable-line
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

<style lang="sass">
  .center
    margin: auto
    width: 100vw
    height: 100vh

  .el-loading-mask
    background-color: transparent
</style>
