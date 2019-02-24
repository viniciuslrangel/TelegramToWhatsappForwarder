<template lang="pug">
  div
    h1 HOMEEE
    el-row(type="flex" justify="space-between")
      el-col.vertScroll(:span='6')
        el-card(v-for="phone in phoneList" :key="phone.id" shadow="hover")
          el-switch(:active-text="phone.title" @input="(value) => leftInput(value, phone)" :value="using[phone.id]")
      el-col(:span='6')
        | RIGHT
</template>
<script>

export default {
  data() {
    return {
      using: {}
    }
  },
  computed: {
    phoneList() {
      const { phoneList, activeList } = this.$store.state.Telegram
      return phoneList.concat(activeList)
        .filter((e, i, arr) => arr.findIndex(e2 => e.id === e2.id) === i)
        .sort((a, b) => {
          const aI = activeList.indexOf(a)
          const bI = activeList.indexOf(b)
          if (aI !== -1 && bI === -1) {
            return -1
          }
          if (aI === -1 && bI !== -1) {
            return 1
          }
          return 0
        })
    }
  },
  methods: {
    leftInput(value, phone) {
      const { id } = phone
      if (value) {
        this.$data.using[id] = true
      } else {
        delete this.$data.using[phone.id]
      }
      this.$data.using = Object.assign({}, this.$data.using)
      const { phoneList } = this.$store.state.Telegram
      this.$store.dispatch('Telegram/setActivePhones', phoneList.filter(e => this.$data.using[e.id]))
    }
  }
}
</script>

<style lang="scss" scoped>
.vertScroll {
  overflow-y: auto;
}
</style>
