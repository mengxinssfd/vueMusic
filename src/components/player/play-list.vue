<template>
  <transition name="show" @enter="refresh">
    <div class="play-list" :style="dialogShowFlag?'z-index:11;':''">
      <div class="mask" @click="clickMask"></div>
      <div class="content">
        <div class="title">
          <div class="left" @click="setMode()">
            <div class="left-content">
              <span class="icon-mode" :class="getModeClass"></span><span class="mode-name">{{getModeName}}</span> <span
              class="song-count">({{sequenceList.length}})</span>
            </div>
          </div>
          <div class="right">
            <span class="clear icon-bin" @click.stop="clickClear"></span>
          </div>
        </div>
        <scroll ref="scroll" class="list">
          <ul ref="listUl">
            <transition-group name="item" mode="out-in">
              <li
                class="list-item"
                v-for="(song,index) in sequenceList"
                :class="{'playing':currentSong.id === song.id}"
                @click="clickItem(index)"
                :key="song.id"
              >
                <div class="left">
                  <div class="left-content">
                    <span class="pay" v-if="song.payplay">pay</span>
                    <span class="icon-play" v-if="currentSong.id === song.id"></span>
                    <span class="song-name" :class="{'need-pay':song.payplay}">{{song.name}}</span><span
                    class="singer"> - {{song.singer}}</span>
                  </div>
                </div>
                <div class="right" @click.stop>
                  <div class="wrapper">
                    <div class="icon-heart" v-if="!song.payplay" :class="{'favorite':isFavorite(song)}"
                         @click.stop="changeFavorite(song)"></div>
                    <div class="btn-delete icon-cross" @click.stop="clickDelete(song)"></div>
                  </div>
                </div>
              </li>
            </transition-group>
          </ul>
        </scroll>
      </div>
      <div class="dialog-wrapper">
        <i-dialog v-show="dialogShowFlag"
                  :dialog="dialog"
                  @closeDialog="dialogShowFlag = false"
        ></i-dialog>
      </div>
    </div>
  </transition>
</template>

<script>
  import scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import {mapGetters, mapActions} from 'vuex'
  import {playerMixin} from "../../common/js/mixin";
  import Dialog from 'base/dialog/dialog';

  export default {
    mixins: [playerMixin],
    components: {
      scroll,
      SongList,
      iDialog: Dialog
    },
    data() {
      return {
        dialogShowFlag: false,
        dialog: {
          content: '是否清空播放列表?',
          yes: '清空',
          no: '取消',
          noHandler: null,
          yesHandler: null
        },
        test: 'test'
      }
    },
    methods: {
      ...mapActions(['selectSongs', 'songListDeleteOne', 'clearSongList']),
      clickMask() {
        this.$emit('closePlayList');
      },
      clickClear() {
        this.dialog.yesHandler = () => {
          this.clearSongList();
        };
        this.dialogShowFlag = true;
      },
      clickDelete(song) {
        this.songListDeleteOne(song);
      },
      clickItem(index) {
        this.selectSongs({songs: this.sequenceList, index});
      },
      refresh() {
        let scroll = this.$refs.scroll;
        let playing = this.$refs.listUl.getElementsByClassName('playing')[0];
        scroll.refresh();
        scroll.scrollToElement(playing)
      },
      onDialogSelect(flag) {
        console.log(flag);
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .play-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 60px
    z-index: 10
    .mask
      height: 100%
      background: rgba(0, 0, 0, 0.3)
    .content
      position: absolute
      bottom: 0
      width: 100%
      background: $color-background
      .title
        padding: 0 10px
        line-height: 36px
        background: $color-highlight-background
        font-size: $font-size-medium-x
        & > div
          display: inline-block
        .left
          width: 300px
          .left-content
            display: flex
            align-items: center
            & > span
              display: inline-block
            .icon-mode
              margin-right: 4px
        .right
          float: right
          font-size: $font-size-medium-x
      .list
        max-height: 240px
        overflow: hidden
        .list-item
          display: flex
          align-items: center
          padding: 0 10px
          line-height: 40px
          color: $color-text
          font-size: $font-size-medium
          &:nth-of-type(even)
            background: #262525
            &.item-leave-to
              opacity: 0
              transform: translateX(100%)
          .left
            flex: 1
            overflow: hidden
            .left-content
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
              .need-pay
                text-decoration: line-through
              .singer
                font-size: $font-size-small-s
                color: $color-text-l
              .pay
                margin-right 4px
                padding: 0 2px 3px 2px
                font-size: $font-size-small-s
                color: $color-theme
                border: 1px solid $color-theme
                border-radius: 4px
          .right
            display: inline-block
            flex: 0 0 48px
            color: $color-text-l
            .wrapper
              display: flex
              align-items: center
              font-size: $font-size-medium
              line-height: 100%
              .icon-heart
                display: inline-block
                line-height: 40px
                padding-right: 10px
              .favorite
                color: $color-theme
              .btn-delete
                display: inline-block
                padding-left: 10px
                font-size: 10px
                line-height: 40px
          &.playing
            color: $color-theme
            .singer
              color: $color-theme

  .show-enter-active, .show-leave-active
    transition: all .8s ease-out
    .content
      transition: all .8s ease-in-out

  .show-enter, .show-leave-to
    opacity: 0
    .content
      transform: translateY(100%)

  .item-leave-active
    transition: all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)

  /*transition: all 1s*/

  .item-leave-to
    opacity: 0
    transform: translateX(-100%)
</style>
