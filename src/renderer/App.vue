<template lang="pug">
  #app
    router-view
</template>

<script>
export default {
  name: 'telegram-to-whatsapp-forwarder'
}
</script>

<style lang="scss">
body {
  background-color: #ff00ff;
  div {
    background-color: #00ff00;
    color: black;
  }
}
* {
  user-select: none;
  cursor: default;
}

input {
  cursor: auto;
}

</style>
