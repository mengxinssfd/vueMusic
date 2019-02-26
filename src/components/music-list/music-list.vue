<template>
  <div class="music-list">
    <div class="back">
      <div class="bg" v-show="scrollY < -10">
        <img width="100%" :src="avatar" alt="">
        <div class="filter"></div>
      </div>
      <i class="icon-left" @click="back"></i>
      <span class="title">{{title}}</span>
    </div>
    <div class="avatar" ref="avatar">
      <img :src="avatar" width="100%" @error="onImgLoadError" alt="">
      <div class="filter"></div>
      <div class="play" v-show="songs.length>0">
        <div class="wrapper" @click="randomPlay">
          <i class="icon-play3"></i>
          <span>随机播放全部</span>
        </div>
      </div>
    </div>
    <!--<div class="bg-layer" ref="bgLayer"></div>-->
    <div class="scroll-wrapper" ref="scrollWrapper">
      <scroll ref="scroll" :pullUp="true" @end="onEnd" :probeType="3" :listenScroll="true" @scroll="scroll"
              class="list-scroll">
        <div>
          <song-list :songs="songs" @selectSong="selectSong"></song-list>
          <div class="loadall-loading">
            <loading v-if="!hasLoadAll" :content="'加载中'"></loading>
            <div v-else>我可是有底线的...</div>
          </div>
        </div>
      </scroll>
    </div>

  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import loading from 'base/loading/loading';
  import * as setter from '../../store/mutation-type';
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import {playMode} from '../../store/config';
  import {bus, busEvents} from "../../base/bus/bus";
  import {playListMixin} from "../../common/js/mixin";
  import img from 'common/images/default.jpg';
  // import {prefixStyle} from "../../common/js/dom";

  let BACK_HEIGHT = 32;
  export default {
    mixins: [playListMixin],
    props: {
      avatar: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      hasLoadAll: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        scrollY: 0
      };
    },
    components: {
      scroll,
      SongList,
      loading
    },

    mounted() {
      this.avatarDom = this.$refs.avatar;
      // console.log(prefixStyle("transform:translateY(0)"));
      // this.minTransitionY = -(this.avatarDom.clientHeight - BACK_HEIGHT);
      this.$refs.scrollWrapper.style.top = this.avatarDom.clientHeight + 'px';

      /* bus.$on(busEvents.play, () => {
         console.log('play');
         bus.$off('selectSong');
       });*/
      /*bus.$once(busEvents.play, () => {
        console.log('play');
      });*/
    },
    watch: {
      scrollY(y) {

        // 视频上的要推动bgLayer,用头像遮住list，但是手机上会闪烁，
        // 因为有可能list划上去很多才监听到事件；现在改成back上加个背景来遮住list
        /*// let layer = this.$refs.bgLayer;
        let max = Math.max(y, this.minTransitionY);
        // layer.style.top = max + 'px';

        if (max === this.minTransitionY) {
          // layer.style.top = 0;
          this.avatarDom.style.paddingBottom = BACK_HEIGHT + 'px';
          this.avatarDom.style.zIndex = 5;
        } else {
          this.avatarDom.style.paddingBottom = '70%';
          this.avatarDom.style.zIndex = '-1';
        }*/

        if (y > 0) {
          let percent = Math.abs(y / this.avatarDom.clientHeight);
          this.avatarDom.style.transform = `scale(${1 + percent})`;
          this.avatarDom.style.zIndex = 5;
        } else {
          this.avatarDom.style.transform = `scale(1)`;
          this.avatarDom.style.zIndex = 0;
          /*   // 手机上会很卡,弃用
             let blur = Math.min(10, 10 * percent);
             this.avatarDom.getElementsByTagName('img')[0].style.filter = 'blur(' + blur + 'px)';*/
        }

      },
      fullScreen(n) {
        if (!n) {
          this.$refs.scroll.refresh();
        }
      }
    },
    computed: {
      ...mapGetters(['fullScreen', 'mode', 'showPlayerSingerDetail'])
    },
    methods: {
      ...mapActions(['selectSongs', 'songUrlAddVkey']),
      ...mapMutations({
        setPlayMode: setter.SET_MODE,
        setSinger: setter.SET_SINGER,
        closeDetail: setter.SET_SHOW_PLAYER_SINGER_DETAIL
      }),
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : '';
        this.$refs.scrollWrapper.style.bottom = bottom;
      },
      back() {
        let path = window.location.pathname;
        path = path.substring(0, path.lastIndexOf('/'));
        // console.log(this.showPlayerSingerDetail);
        if (this.showPlayerSingerDetail) {
          this.closeDetail(false);
        } else {
          this.$router.push(path);
        }
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      selectSong(song, index) {
        let songs = this.songs;
        // this.songUrlAddVkey({song, index});
        this.selectSongs({songs, index});
      },
      randomPlay() {
        // if (this.mode === playMode.random) return;
        if (this.hasLoadAll) {
          let songs = this.songs;
          let index = parseInt(Math.random() * songs.length);
          this.selectSongs({songs, index});
          this.setPlayMode(playMode.random);
        } else {
          // 没有获取全部歌曲时，交给父组件获取全部再播放
          this.$emit('randPlayAll');
        }
        bus.$emit(busEvents.play);
      },
      onEnd() {
        this.$emit('end');
      },
      onImgLoadError(event) {
        event.target.src = img;
      }
    },

  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import '~common/stylus/variable.styl'
  .music-list
    position: fixed
    top: 0
    left: 0
    bottom: 0
    width: 100%
    z-index: 10
    background: $color-background
    .back
      position: absolute
      top: 0
      width: 100%
      padding: 0 33px
      z-index: 10
      text-align: center
      font-size: 0
      box-sizing: border-box
      overflow: hidden
      .icon-left
        display: inline-block
        vertical-align: top
        position: absolute
        left: 0
        font-size: 32px
      .title
        display: block
        position: relative
        font-size: 16px
        line-height: 32px
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        color: $color-text-ll
      .bg
        position: absolute
        display block
        top: 0
        left: 0
        width: 100%
        height: 100%
        // z-index: -1
        img
          display: block
        .filter
          position: absolute
          top: 0
          left: 0
          width: 100%
          height 100%
          background: rgba(7, 17, 27, 0.4)
    .avatar
      position: relative
      // z-index: -1
      width: 100%
      height: 0
      padding-bottom: 70%
      overflow: hidden
      transform-origin: top
      .filter
        position: absolute
        width: 100%
        height 100%
        background: rgba(7, 17, 27, 0.4)
      //filter: blur(20px)
      //transform-origin: center
      //transform: scale(1.3)
      img
        display: block
        position: absolute
      .play
        position: absolute
        z-index: 10
        bottom: 20px
        left: 0
        width: 100%
        text-align: center
        .wrapper
          display: inline-block
          padding: 0 10px
          font-size: $font-size-medium-x
          font-weight: 700
          line-height: 30px
          border: $color-theme 1px solid
          border-radius: 15px
    /*border-radius: 15px*/
    .bg-layer
      position: relative
      width: 100%
      height: 100%
      background: $color-background
    .scroll-wrapper
      position: absolute
      width: 100%
      top: 0
      bottom: 0
      left: 0
      background: $color-background
      .list-scroll
        /*overflow: hidden*/
        height: 100%
        width: 100%
        .loadall-loading
          height: 50px
          text-align: center
          font-size: $font-size-medium
</style>
