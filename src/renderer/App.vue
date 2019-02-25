<template lang="pug">
  #app
    router-view
</template>

<script>
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
