<template lang="pug">
  el-container
    .center(v-loading="true")
</template>

<script>
	import {ipcRenderer} from 'electron' // eslint-disable-line

export default {
  mounted() {
    ipcRenderer.send('Telegram/CREATE')
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
