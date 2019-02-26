<template>
  <div class="m-header">
    <h1 class="text"><i class="icon-music"></i> Music</h1>

    <router-link tag="div" class="mine" to="/user">
      <!--<i class="icon-mine"></i>-->
      <i class="icon-user"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .m-header
    position: fixed
    top: 0
    left: 0
    right: 0
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    &:before
      content: ''
      position: absolute
      left: 0
      right: 0
      top: -100px
      bottom: 44px
      background: $color-background
    .text
      position: relative
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .icon-music
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      //.icon-mine
      .icon-user
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
