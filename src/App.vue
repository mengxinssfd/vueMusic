<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
      <router-link tag="div" class="tab-item" to="/recommend"><span>推荐</span></router-link>
      <router-link tag="div" class="tab-item" to="/singer"><span>歌手</span></router-link>
      <router-link tag="div" class="tab-item" to="/rank"><span>排行</span></router-link>
      <router-link tag="div" class="tab-item" to="/search"><span>搜索</span></router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <video-player></video-player>
  </div>
</template>

<script type="text/ecmascript-6">
  import player from 'components/player/player';
  import VideoPlayer from 'components/player/video-player';
  import mHeader from 'components/m-header/m-header';

  export default {
    components: {
      'v-header': mHeader,
      player,
      VideoPlayer,
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import 'common/stylus/variable.styl'
  #app
    color: $color-theme
    width: 100%
    .tab
      position: fixed
      top: 44px
      left: 0
      display: flex
      align-items: center
      width: 100%
      height: 44px
      line-height: 44px
      font-size: $font-size-medium
      .tab-item
        flex: 1
        text-align: center
        span
          padding-bottom: 5px
          color: $color-text-l
        &.active
          span
            color: $color-theme
            border-bottom: 2px solid $color-theme
</style>
