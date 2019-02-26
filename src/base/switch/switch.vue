<template>
  <div class="switch">
    <div
      class="switch-item"
      v-for="item in switches"
      :class="{'current':currentSwitch === item.id}"
      @click="clickSwitchItem(item.id)"
    >
      {{item.text}}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default() {
          return [];
        }
      },
      currentSwitch: {
        type: Number,
        default: 0
      }
    },
    methods: {
      clickSwitchItem(id) {
        this.$emit('switchChange', id);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .switch
    display: flex
    width: 70%
    border: 1px solid $color-highlight-background
    border-radius: 8px
    font-size: 0
    overflow: hidden
    margin: 0 auto
    padding: 0
    .switch-item
      flex: 1
      line-height: 36px
      text-align: center
      margin: 0
      padding: 0
      font-size: $font-size-medium-x
      &.current
        background: $color-highlight-background
</style>
