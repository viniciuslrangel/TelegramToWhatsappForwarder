<template lang="pug">
    h1 LOGIN HERE
      el-input-number(v-model='phone' placeholder='+55 99 999999999')
</template>

<script>
export default {
  data: () => ({
    phone: ''
  })
}
</script>

<style lang="scss" scoped>
</style>

