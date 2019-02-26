<template>
  <div class="video-player" v-if="mvList.length > 0" @click="close">
    <transition name="qlt">
      <div class="quality" @click.stop v-show="canShowQuality" :class="{'play':qualityShowFlag}">
        <div class="quality-list">
          <ul>
            <li
              class="quality-item"
              v-for="(item,index) in mvList.slice(1)"
              :class="{'active':index+1 === outer,'cant-play':cantPlay.indexOf(index + 1)> -1}"
              @click.stop="clickQualityItem(index)"
            >{{getQualityItemText(index)}}
            </li>
          </ul>
        </div>
        <div class="select" @click.stop="clickQualitySelect">画质</div>
      </div>
    </transition>
    <div class="video-wrapper">
      <video ref="video" @pause="onPause" @playing="onPlaying" :src="mvList[outer][inner]" @error="onError" autoplay
             controls @click.stop></video>
    </div>
    <div class="dialog-wrapper">
      <i-dialog v-show="showDialogFlag" :dialog="dialog" @closeDialog="showDialogFlag = false"></i-dialog>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_MVLIST} from "../../store/mutation-type";
  import Dialog from 'base/dialog/dialog';

  export default {
    components: {
      iDialog: Dialog,
    },
    data() {
      return {
        inner: 0,
        // outer: 0,
        outer: 1,
        qualityShowFlag: false,
        canShowQuality: true,// 只有暂停的时候才可以选择画质,播放的时候切换很大概率不成功
        showDialogFlag: false,
        cantPlay: [],// 存储不能播放的mvList的index
        dialog: {
          content: '',
          yes: '是',
          no: '否',
          yesHandler: null,
          css: {
            top: '100%',
            transform: 'translate3d(-50%,-140%,0)',
          }
        }
      }
    }
    ,
    watch: {
      mvList(newValue) {
        // 从后面遍历video src list
        if (newValue.length === 0) {
          if (this.$refs.video) {
            this.$refs.video.pause();
          }
        } else {
          // this.outer = newValue.length - 1;
          // 初始化
          this.outer = 1;
          this.inner = newValue[this.outer].length - 1;
          this.cantPlay = [];
          this.qualityShowFlag = false;
        }
      }
    }
    ,
    computed: {
      ...
        mapGetters(['mvList']),
    }
    ,
    methods: {
      ...
        mapMutations({setMvList: SET_MVLIST}),
      close() {
        this.setMvList([]);
      }
      ,
      onError() {
        console.log('error');
        // console.log(this.mvList[this.outer][this.inner]);

        // 183.60.131
        // 219.132.192
        // 219.135.57
        if (this.inner > 0) {
          this.inner--;
        } else {
          this.dialog.content = '此mv的' + this.getQualityItemText(this.outer - 1) + '无法播放,是否降低画质';
          this.cantPlay.push(this.outer);
          this.dialog.yesHandler = () => {
            if (this.outer > 0) {
              this.outer--;
            }
          };
          this.showDialogFlag = true;
        }
        /* else {
                 if (this.outer > 0) {
                   this.outer--;
                   this.inner = this.mvList[this.outer].length - 1;
                 } else {
                   console.log('该MV无法播放！');
                 }
               }*/
      }
      ,
      onPause() {
        // console.log('onPause');
        this.canShowQuality = true;
      }
      ,
      onPlaying() {
        // console.log('onPlaying');
        this.canShowQuality = false;
      }
      ,
      getQualityItemText(index) {
        let text = '';
        switch (index) {
          case 0:
            text = '270p';
            break;
          case 1:
            text = '480p';
            break;
          case 2:
            text = '720p';
            break;
          case 3:
            text = '1080p';
            break;
        }
        return text;
      }
      ,
      clickQualitySelect() {
        this.qualityShowFlag = !this.qualityShowFlag;
      }
      ,
      clickQualityItem(index) {
        // 不能点击
        if (this.cantPlay.indexOf(index + 1) > -1) return;
        this.outer = index + 1;
        this.inner = this.mvList[this.outer].length - 1;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .video-player
    position: fixed
    z-index: 20
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    .quality
      position: absolute
      bottom: 0
      left: 0
      line-height: 30px
      color: $color-text-ll
      font-size: $font-size-medium-x
      border-radius: 4px 0 0 4px
      background: $color-background
      transition: all .5s
      &.play
        transform: translateX(-100%)
      .select
        position: absolute
        top: 0
        right: 0
        padding: 6px 12px
        transform: translateX(100%)
        border-radius: 0 4px 4px 0
        color: $color-theme-d
        background: $color-highlight-background
      & > div
        display: inline-block
      .quality-list
        color: $color-text-ll
        .quality-item
          display: inline-block
          padding: 6px 10px
          & + li
            border-left: 1px solid $color-highlight-background
          &.active
            background: $color-text-l
            pointer-events: none

    .video-wrapper
      position: absolute
      top: 50%
      transform: translateY(-50%)
      width: 100%
      video
        width: 100%
    .dialog-wrapper
      position: absolute
      z-index: 1000

  .cant-play
    text-decoration: line-through

  .qlt-enter-active, .qlt-leave-active
    transition: all .5s

  .qlt-enter, .qlt-leave-to
    opacity: 0
</style>
