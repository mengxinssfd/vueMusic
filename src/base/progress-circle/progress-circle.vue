<template>
  <div class="progress-circle">
    <svg width="32" height="32" viewBox="0 0 100 100" version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="314"
              :stroke-dashoffset="getPercent"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        test: 290
      }
    },
    computed: {
      getPercent() {
        // 314为圆的周长
        return (1 - this.percent / 100) * (Math.PI * 2 * 50);
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .progress-circle
    //position: absolute
    line-height: 0 //这里莫名的会被撑高很多
    //top: 50%
    //left: 50%
    //transform: translate3d(-50%, -50%, 0)
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: rgba(0, 0, 0, 0.5)
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
