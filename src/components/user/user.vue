<template>
  <div class="user" ref="user">
    <div class="direct">
      <i class="icon icon-down" @click="clickBack"></i>
      <i-switch :switches="switches" :currentSwitch="currentSwitch" @switchChange="onSwitchChange"></i-switch>
    </div>
    <div class="random-play">
      <div class="wrapper" @click="clickRandomPlay">
        <span class="icon-play"></span><span>随机播放全部</span>
      </div>
    </div>
    <div class="list">
      <scroll class="scroll-list" ref="scroll">
        <song-list :songs="showList" @selectSong="onSelectSong"></song-list>
      </scroll>
    </div>
  </div>
</template>

<script>
  import Switch from 'base/switch/switch';
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import {mapGetters, mapActions, mapMutations} from 'vuex';
  import {playListMixin} from "../../common/js/mixin";
  import {SET_MODE} from "../../store/mutation-type";
  import {playMode} from "../../store/config";

  let switchType = {
    favorite: 0,
    played: 1
  };
  let fromURL = '';
  export default {
    beforeRouteEnter(to, from, next) { // 获取来自的url
      fromURL = from.path;
      // console.log(fromURL);
      next();
    },
    mixins: [
      playListMixin
    ],
    components: {
      ISwitch: Switch,
      Scroll,
      SongList
    },
    data() {
      return {
        switches: [
          {
            id: 0,
            text: '收藏'
          }, {
            id: 1,
            text: '最近播放'
          }
        ],
        currentSwitch: 0,
        showList: [],
      };
    },
    watch: {
      currentSwitch(newValue) {
        if (newValue === switchType.favorite) {
          this.showList = this.favoriteList;
        } else if (newValue === switchType.played) {
          this.showList = this.playedList;
        }
        this.$refs.scroll.refresh();
      },
      playedList(newValue) {
        if (this.currentSwitch === switchType.played) {
          this.showList = newValue;
          this.$refs.scroll.refresh();
        }
      },
      favoriteList(newValue) {
        if (this.currentSwitch === switchType.favorite) {
          this.showList = newValue;
          this.$refs.scroll.refresh();
        }
      }
    },
    mounted() {
      this.showList = this.favoriteList;
    },
    computed: {
      ...mapGetters(['playedList', 'favoriteList']),
    },
    methods: {
      ...mapActions(['selectSongs']),
      ...mapMutations({setMode: SET_MODE}),
      handlePlayList(playList) {
        this.$refs.user.style.bottom = playList.length > 0 ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      clickBack() {
        this.$router.push(fromURL ? fromURL : '/recommend');
      },
      clickRandomPlay() {
        if (!this.showList || this.showList.length === 0) return;
        let index = parseInt(Math.random() * this.showList.length);
        this.selectSongs({songs: this.showList, index});
        this.setMode(playMode.random);
      },
      onSwitchChange(switchId) {
        this.currentSwitch = switchId;
      },
      onSelectSong(song, index) {
        // console.log(song);
        this.selectSongs({songs: this.showList, index});
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"

  .user
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background
    .direct
      position: relative
      margin: 10px 0 30px 0
      .icon
        display: inline-block
        position: absolute
        padding: 0 5px
        line-height: 36px
        top: 0
        left: 0
        font-size: 32px
    .random-play
      text-align: center
      .wrapper
        display: inline-block
        margin: 0 auto
        padding: 0 10px
        border: 1px solid $color-theme
        border-radius: 15px
        line-height: 30px
        font-size: $font-size-medium-x
    .list
      position: absolute
      top: 116px
      bottom: 0
      width: 100%
      .scroll-list
        height: 100%
        overflow: hidden
</style>
