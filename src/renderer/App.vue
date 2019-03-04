<template lang="pug">
  #app
    router-view
</template>

<script>

import { ipcRenderer, remote } from 'electron' // eslint-disable-line

document.addEventListener('keydown', (e) => {
  if (e.which === 123) {
    ipcRenderer.send('Whatsapp/TOOGLE_VISIBILITY')
  } else if (e.which === 122) {
    remote.getCurrentWindow().toggleDevTools()
  }
})

export default {
  name: 'telegram-to-whatsapp-forwarder'
}
</script>

<style lang="sass">
  @import url('https://fonts.googleapis.com/css?family=Righteous')

  body
    margin: 0
    background-color: #004d40

  *
    font-family: 'Roboto', sans-serif
    user-select: none
    cursor: default

  input
    cursor: auto
</style>
