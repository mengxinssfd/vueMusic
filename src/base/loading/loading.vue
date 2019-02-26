<template>
  <div class="loading">
    <img width="24" src="./loading.gif" alt="">
    <span>{{content}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        default: '正在载入'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  .loading
    width: 100%
    height: 100%
    text-align: center
    img
      display: block
      margin: auto
    span
      line-height: 20px
      font-size: 12px
      color: $color-text-l
      &:after
        content: '...'


</style>
