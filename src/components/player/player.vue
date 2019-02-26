<template>
  <transition name="player">
    <div class="player" v-show="playList.length>0" ref="myPlayer">
      <div class="detail-wrapper">
        <singer-detail :singerFromPlayer="singer" v-if="showPlayerSingerDetail"></singer-detail>
      </div>
      <transition
        tag="div"
        name="full_transition"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div class="full-player" ref="fullPlayer" v-show="fullScreen">
          <div class="bg">
            <img width="100%" height="100%" :src="currentSong.image" alt="">
            <div class="filter"></div>
          </div>
          <div class="top" @click="setFullScreen(false)">
            <div class="title-wrapper">
              <i class="icon-down"></i>
              <h2 class="title">{{currentSong.name}}</h2>
            </div>
            <div class="singer">
            <span v-for="(singer,index) in currentSong.singerList" @click.stop="clickName(singer)">{{singer.name}}<span
              v-if="index !== currentSong.singerList.length-1">/</span></span>
            </div>
          </div>
          <div class="middle" @click="clickFullPlayerMiddle">
            <div :class="{'page-top':showPage === pages.CD}" class="cd-wrapper">
              <div class="cd">
                <img :class="{'play':playing,'play pause':!playing}" :src="currentSong.image"
                     @error="onImgError">
              </div>
            </div>
            <div :class="{'page-top':showPage === pages.LYRIC}" class="lyric" ref="lyric">
              <scroll class="lyric-scroll" ref="lyricScroll">
                <div>
                  <ul v-if="lyric">
                    <li v-for="(line,index) in lyric.lines" class="lyric-item"
                        :class="{'current-line':currentLine === index}">{{line.txt}}
                    </li>
                  </ul>
                </div>
              </scroll>
              <div v-if="!lyric || lyric.lines.length === 0" class="no-lyric">
                {{noLyric}}
              </div>
            </div>
            <div class="page-index">
              <div v-for="val of pages" class="index" :class="{'active':val === showPage}"></div>
            </div>
          </div>
          <div class="bottom">
            <div class="time-progress">
              <div class="left">
                <div class="current">{{formatDuration(currentTime)}}</div>
                <progress-bar @changeBar="changeBar" :percent="percent"></progress-bar>
              </div>
              <div class="duration">{{formatDuration(currentSong.duration)}}</div>
            </div>
            <div class="controller">
              <div class="icon mode" @click.stop="clickModeBtn"><i :class="getModeClass"></i></div>
              <div class="icon previous" @click="clickPrevBtn"><i class="icon-backward"></i></div>
              <div class="icon play" @click.stop.prevent="clickPlayBtn">
                <i class="icon-play" v-if="!playing"></i>
                <i v-else class="icon-pause"></i>
              </div>
              <div class="icon next" @click="clickNextBtn"><i class="icon-forward"></i></div>
              <div class="icon favorite" :class="{'not-favorite':!currentIsFavorite}" @click="clickFavorite"><i
                class="icon-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <play-list
        @closePlayList="showPlayListFlag = !showPlayListFlag"
        v-show="!fullScreen && showPlayListFlag"
      ></play-list>
      <transition name="mini-transition">
        <div class="mini-player" ref="miniPlayer" v-show="!fullScreen && playList.length>0"
             @click="setFullScreen(true)">
          <div class="left">
            <div class="cd">
              <img :class="{'play':playing,'play pause':!playing}" :src="currentSong.image" width="40" height="40"
                   alt="">
            </div>
            <div class="info">
              <div class="songName">{{currentSong.name}}</div>
              <div class="singer">{{currentSong.singer}}</div>
            </div>
          </div>
          <div class="right">
            <div class="play" @click.stop.prevent="setPlaying()">
              <progress-circle :percent="percent">
                <i class="icon icon-play" v-if="!playing"></i>
                <i v-else class="icon icon-pause"></i>
              </progress-circle>
            </div>
            <div class="play-list" @click.stop="clickPlayList">
              <i class="icon-list"></i>
            </div>
          </div>
        </div>
      </transition>

      <audio ref="audio" @play="onPlay" :src="currentSong.url" @timeupdate="timeUpdate" @abort="onError"
             @playing="onPlaying" @pause="onPause" :loop="_isLoop"
             autoplay>
      </audio>
    </div>
  </transition>
</template>

<script>
  import animations from 'create-keyframe-animation';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import * as setter from '../../store/mutation-type';
  import progressBar from 'base/progress-bar/progress-bar';
  import {bus, busEvents} from "../../base/bus/bus";
  import progressCircle from 'base/progress-circle/progress-circle';
  import {playMode} from "../../store/config";
  import scroll from 'base/scroll/scroll';
  import {prefixStyle} from "../../common/js/dom";
  import {TweenLite} from 'gsap';
  import LyricParse from 'lyric-parser';
  import SingerDetail from './play-singer-detail';
  import img from 'common/images/default.jpg';
  import PlayList from './play-list';
  import {playerMixin} from "../../common/js/mixin";

  const PREV = 0;
  const NEXT = 1;
  const pages = {
    CD: 0,
    LYRIC: 1
  };

  export default {
    mixins: [playerMixin],
    data() {
      return {
        currentTime: 0,
        percent: 0,
        currentLine: 0,
        lyric: null,
        pages: pages,
        showPage: pages.CD,
        showPlayListFlag: false,
        singer: {}
      };
    },
    computed: {
      ...mapGetters(['fullScreen', 'playList', 'playing', 'currentIndex', 'showPlayerSingerDetail',]),
      _isLoop() {
        return this.mode === playMode.loop;
      },
      noLyric() {
        let lyric = this.currentSong.lyric;
        if (lyric) {
          let i = lyric.indexOf(']');
          return i !== -1 ? lyric.substr(i + 1) : lyric;
        } else {
          return '获取歌词...'
        }
      }
    }
    ,
    components: {
      progressBar,
      progressCircle,
      scroll,
      SingerDetail,
      PlayList,
    }
    ,
    watch: {
      playing(newP) {
        // console.log('playing', this.audio.readyState, this.audio.paused);
        if (!newP) {
          if (this.audio.readyState) {
            this.audio.pause();
          }

        } else {
          if (this.audio.readyState) {
            this.audio.play();
          }

        }
      }
      ,
      currentSong(newSong, oldSong) {
        if (!newSong.id || newSong === oldSong) return;

        // 清理掉上一首的歌词
        this.clearLyric();

        // 需要支付才能播放的歌曲,跳过
        if (newSong.payplay > 0) {
          this._changeCurrentSong(NEXT);
          return;
        }

        // 获取歌词
        if (!newSong.lyric) {
          this.songAddLyric({song: newSong, handler: this.addLyric});
        } else {
          this.addLyric(newSong.lyric);
        }

        // 歌曲添加url和vkey
        if (!newSong.url) {
          this.songUrlAddVkey(newSong);
        }

        if (!this.playing) {
          this.setPlaying(true);
        }
        this.currentTime = 0;

        this.playedAddOne(newSong);
      }
      ,
      showPage(newValue) {
        let fp = this.$refs.fullPlayer;
        let cd = fp.getElementsByClassName('cd-wrapper')[0];
        let lyric = fp.getElementsByClassName('lyric')[0];
        if (newValue === pages.CD) {
          TweenLite.to(cd, 0.5, {css: {opacity: 1}});
          TweenLite.to(lyric, 0.5, {css: {opacity: 0}});
        } else {
          TweenLite.to(cd, 0.5, {css: {opacity: 0}});
          TweenLite.to(lyric, 0.5, {css: {opacity: 1}});
        }
      }
      ,
      fullScreen(newValue) {
        if (this.fullScreen) {
          setTimeout(() => {
            this.$refs.lyricScroll.refresh();
            this.lyricScrollTo({time: 0});
          }, 350);

        }
      },
      playList(newValue) {
        if (!newValue || newValue.length === 0) {
          this.showPlayListFlag = false;
          this.setPlaying(false);
        }
      }
    }
    ,
    mounted() {
      this.audio = this.$refs.audio;
      this.audio.addEventListener('ended', () => {
        if (this.currentIndex === this.playList.length - 1) {
          this.setPlaying(false);
        } else {
          this.nextSong();
        }
      });
      bus.$once(busEvents.play, () => {
        /* if (!this.timer) {
           this.timer = setTimeout(() => {
             if (this.audio.paused) {
               this.audio.play();
             }
           }, 1000);
         }*/
        this.forcePlay();
      });
    }
    ,
    methods: {
      ...
        mapMutations({
          setFullScreen: setter.SET_FULLSCREEN,
          setPlaying: setter.SET_PLAYING,
          setSinger: setter.SET_SINGER,
          showSingerDetail: setter.SET_SHOW_PLAYER_SINGER_DETAIL,
        }),
      ...
        mapActions(['songUrlAddVkey', 'nextSong', 'prevSong', 'songAddLyric', 'playedAddOne']),
      _getPosAndScale() {
        // let miniPlyaerCD = this.$refs.miniPlayer.getElementsByClassName('cd-wrapper')[0];
        // const {x: mX, y: mY, width: mWidth} = miniPlyaerCD.getBoundingClientRect();
        const miniPlayerPadding = 10;
        const mWidth = 40;
        const mX = miniPlayerPadding + mWidth / 2;
        const mY = window.innerHeight - miniPlayerPadding - mWidth / 2;

        const fullWidth = window.innerWidth * 0.8;
        const fullX = window.innerWidth / 2;
        // 74 top的高度
        const fullY = 74 + fullWidth / 2;
        let x = mX - fullX;
        let y = mY - fullY;
        let scale = mWidth / fullWidth;
        // console.log(mX, mY, mWidth, mHeight);
        // fullPlayerCD.style.webkitTransform = `translate3d(${mX - fX}px,${mY - fY}px,0)`;
        // fullPlayerCD.style.transform = `translate3d(${mX - fX}px,${mY - fY}px,0)`;
        return {x, y, scale};
      }
      ,
      _getAnimation(name, x, y, scale, direction) {
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          50: {
            transform: 'translate3d(0,0,0) scale(1.1)'
          },
          100: {
            transform: 'translate3d(0,0,0) scale(1)'
          }
        };
        return {
          name: name,
          animation,
          presets: {
            duration: 1000,
            easing: 'linear',
            direction: direction,
          }
        }

      }
      ,
      enter: function (el, done) {
        let name = 'enter'
        let {x, y, scale} = this._getPosAndScale();
        let ele = this.$refs.fullPlayer.getElementsByClassName('cd-wrapper')[0];
        animations.registerAnimation(this._getAnimation(name, x, y, scale, 'normal'));
        animations.runAnimation(ele, name, done);
      }
      ,
      afterEnter: function (el) {
        animations.unregisterAnimation('enter');
        this.$refs.fullPlayer.getElementsByClassName('cd-wrapper')[0].style.animation = '';
      }
      ,
      leave: function (el, done) {
        /* animations.registerAnimation({
           name: 'move',
           animation: this._getAnimation(x, y, scale),
           presets: {
             duration: 800,
             easing: 'linear',
             // direction: 'normal'
           }
         });*/
        let ele = this.$refs.fullPlayer.getElementsByClassName('cd-wrapper')[0];
        let {x, y, scale} = this._getPosAndScale();
        let name = 'leave';
        animations.registerAnimation(this._getAnimation(name, x, y, scale, 'reverse'));
        animations.runAnimation(ele, name, done);
      }
      ,
      afterLeave: function (el) {
        animations.unregisterAnimation('leave');
        this.$refs.fullPlayer.getElementsByClassName('cd-wrapper')[0].animation = '';
      }
      ,
      formatDuration(duration, format) {
        if (format === undefined) {
          format = 'mmm:ss'
        }
        // console.log('duration:', duration);
        let opt = {
          's+': duration % 60,
          'm+': format.match(/m/g).length > 2 ? duration / 60 : duration / 60 % 60,
          'h+': duration / 3600
        };

        for (let key in opt) {
          let val = parseInt(opt[key]) + '';
          if (new RegExp('(' + key + ')').test(format) && val) {
            let replace = (key === 's+' && val.length < 2) ? '0' + val : val;
            format = format.replace(RegExp.$1, replace);
          }
        }
        return format;
      }
      ,
      clickPlayBtn() {
        // this.audio.play();
        this.setPlaying();
      }
      ,
      _changeCurrentSong(direct) {
        // if (this.mode === playMode.loop) return;
        direct === PREV ? this.prevSong() : this.nextSong();
      }
      ,
      clickPrevBtn() {
        this._changeCurrentSong(PREV);
        this.forcePlay();
      }
      ,
      clickNextBtn() {
        this._changeCurrentSong(NEXT);
        this.forcePlay();
      }
      ,
      clickModeBtn() {
        this.setMode();
      }
      ,
      clickFullPlayerMiddle() {
        this.showPage = (this.showPage + 1) % Object.keys(pages).length;
      }
      ,
      clickName(singer) {
        // alert(singer.name + '' + singer.mid);
        // console.log(singer);
        this.setFullScreen();
        // console.log(singer);
        // this.setSinger(singer);
        this.singer = singer;
        this.showSingerDetail(true);
      }
      ,
      clickPlayList() {
        this.showPlayListFlag = !this.showPlayListFlag;
      },
      clickFavorite() {
        this.changeFavorite(this.currentSong);
      },
      onImgError(event) {
        event.target.src = img;
      },
      onPlay() {
        if (!this.playing) {
          this.$refs.audio.pause();
          if (this.lyric) {
            this.lyric.togglePlay();
          } else {
            // 获取歌词
            if (!this.currentSong.lyric) {
              this.songAddLyric({song: this.currentSong, handler: this.addLyric});
            } else {
              this.addLyric(this.currentSong.lyric);
            }
          }
        }
      },
      onPlaying() {
        // 拖动进度条或者循环播放时都会触发该事件
        if (this.lyric && this.playing) {
          this.lyric.seek(this.currentTime * 1000);
          this.$nextTick(() => {
            if (!this.playing) {
              this.lyric.seek(this.currentTime * 1000);
              this.lyric.togglePlay();
            }
          });
        }
      },
      onPause() {
        if (this.lyric) {
          this.lyric.togglePlay();
        }
      },
      addLyric(lyric) {
        this.lyric = new LyricParse(lyric, this.lyricHandler);
      }
      ,
      timeUpdate() {
        // 同一秒不执行
        // if (this.currentTime === currentTime) return;
        this.currentTime = this.audio.currentTime;
        this.percent = parseFloat((this.currentTime / this.currentSong.duration * 100).toFixed(2));
      }
      ,
      clearLyric() {
        this.currentTime = 0;
        this.percent = 0;
        // 清理掉上一首的歌词
        if (this.lyric) {
          this.lyric.seek(0);
          this.lyric.togglePlay();
          this.lyric.stop();
          this.lyric = null;
        }
      },
      forcePlay() {
        // 清理掉上一首的歌词
        this.clearLyric();

        if (this.audio.readyState) {
          if (this.audio.paused) {
            this.audio.play();
          }
        } else {
          if (this.audio.paused) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              if (this.audio.paused) {
                this.audio.play();
              }
            }, 1000);
          }
        }
      }
      ,
      changeBar(percent) {
        let time = percent * this.currentSong.duration;
        console.log(time);
        this.audio.currentTime = time;

        if (this.lyric) {
          this.lyric.seek(time * 1000);
          if (!this.playing) {
            this.lyric.togglePlay(this.lyric);
          }
        }
      }
      ,
      lyricHandler({lineNum, txt}) {
        if (!this.playing) {
          this.lyric.togglePlay();
        }
        this.currentLine = lineNum;
        // console.log(lineNum, txt);
        if (this.fullScreen && this.lyric) {
          this.lyricScrollTo({time: 1000});
        }
      }
      ,
      lyricScrollTo({time = 0}) {
        let lyric = this.$refs.lyric;
        if (!lyric) return;
        let lyricList = lyric.getElementsByClassName('lyric-item');
        if (lyricList && lyricList.length > 0) {
          let currentEl = lyricList[this.currentLine];
          let lastEl = lyricList[lyricList.length - 1];
          let firstEl = lyricList[0];

          let height = lyric.getBoundingClientRect().height;
          let currentTop = currentEl.getBoundingClientRect().top;
          let firstElTop = firstEl.getBoundingClientRect().top;
          let lastElTop = lastEl.getBoundingClientRect().top;
          let distance = lastElTop - currentTop;
          let top = currentTop - firstElTop - height / 2 + currentEl.getBoundingClientRect().height / 2;
          if (top > 0) {
            if (distance > height / 2) {
              this.$refs.lyricScroll.scrollTo({y: -top, time});
            } else {
              this.$refs.lyricScroll.scrollTo({y: -(lastElTop - firstElTop + 40 - height), time});
            }
          } else {
            this.$refs.lyricScroll.scrollTo({y: 0, time});
          }
        }
      },
      onError(event) {
        // alert('这首歌无法播放');
        console.log('error');
      },
    }
  }
  ;
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .player
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: 20
    background: black
    .detail-wrapper
      // z-index: -1
    .full-player
      position: fixed
      z-index: 200
      top: 0
      left: 0
      right: 0
      bottom: 0
      background: black
      overflow: hidden
      .bg
        position: absolute
        top: 0
        left: 0
        // z-index: -1
        width: 100%
        height: 100%
        img
          filter: blur(40px)
          transform: scale(1.2)
        .filter
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          background: rgba(0, 0, 0, 0.2)
      .top
        position: relative
        padding: 0 20px
        color: $color-text-ll
        .title-wrapper
          font-size: $font-size-large
          text-align: center
          padding: 6px
          margin-bottom: 8px
          overflow: hidden
          .icon-down
            position: absolute
            top: 6px
            left: 5px
            line-height: $font-size-large-x
            font-size: 30px
            font-weight: 1000
            color: $color-theme
          .title
            line-height: $font-size-large-x
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
        .singer
          text-align: center
          margin-bottom: 16px
          font-size: $font-size-medium-x
      .middle
        /*width: 100%*/
        text-align: center
        position: fixed
        left: 0
        top: 76px
        right: 0
        bottom: 100px
        .cd-wrapper
          display: inline-block
          background: rgba(255, 255, 255, 0.5)

          position: relative
          width: 80%
          height: 0
          padding-bottom: 80%
          border-radius: 50%
          .cd
            position: absolute
            left: 50%
            top: 50%
            transform: translate3d(-50%, -50%, 0)
            width: 96%
            img
              display: block
              width: 100%
              padding: 0
              pointer-events: none
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused

        .lyric
          position: absolute
          width: 100%
          left: 0
          top: 0
          bottom: 30px
          overflow: hidden
          box-sizing: border-box
          font-size: $font-size-medium
          /*padding: 0 24px*/
          opacity: 0
          .lyric-scroll
            width: 100%
            height: 100%
            .lyric-item
              padding: 0 24px
              line-height: 40px
              letter-spacing: 1px
              color: $color-text-d
              &.current-line
                color: $color-text-ll
          .no-lyric
            position: absolute
            top: 50%
            transform: translateY(-50%)
            box-sizing: border-box
            width: 100%
            text-align: center
            color: $color-text-ll
        .page-top
          z-index: 50
        .page-index
          position: absolute
          bottom: 0
          width: 100%
          text-align: center
          .index
            display: inline-block
            width: 6px
            height: 6px
            background: $color-text-d
            border-radius: 3px
            & + div
              margin-left: 6px
            &.active
              background: $color-theme
      .bottom
        position: absolute
        bottom: 0
        width: 100%
        padding: 2% 4%
        box-sizing: border-box
        .time-progress
          display: flex
          align-items: center
          font-size: $font-size-small
          line-height: $font-size-small
          height: $font-size-small
          color: $color-text
          margin-bottom: 10px
          & > div
            display: inline-block
            vertical-align: top
          .left
            flex: 1
            display: flex
            align-items: center
            .current
              flex: 0 0 50px
              width: 50px
              text-align: center
            .progress-bar
              flex: 1
              width: 100%
          /* position: relative
           top: 50%
           transform: translateY(-50%)*/
          .duration
            flex: 0 0 50px
            width: 50px
            text-align: center
        .controller
          display: flex
          margin-top: 20px
          line-height: 40px
          font-size: $font-size-large
          .icon
            flex: 1
            text-align: center
          .not-favorite
            color: rgba(0, 0, 0, 0.4)
    .mini-player
      position: fixed
      z-index: 10
      left: 0
      bottom: 0
      width: 100%
      box-sizing: border-box
      display: flex
      align-items: center
      /*visibility: hidden*/
      overflow: hidden
      padding: 10px
      background: $color-highlight-background
      font-size: $font-size-medium-x
      & > div
        display: inline-block
        vertical-align: top
      .left
        flex: 1
        display: flex
        align-items: center
        .cd
          flex: 0 0 40px
          vertical-align: top
          width: 40px
          img
            display: block
            margin: 0
            padding: 0
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
        .info
          margin-left: 10px
          line-height: 40px
          overflow: hidden
          .songName, .singer
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
          .songName
            margin-bottom: 5px
            font-size: $font-size-small
            line-height: $font-size-medium
            color: $color-text
          .singer
            font-size: $font-size-small-s
            line-height: $font-size-small
            color: $color-text-l
      .right
        display: flex
        flex: 0 0 80px
        align-items: center
        .play
          line-height: 40px
          width: 40px
          text-align: center
          position: relative
          .icon
            display: inline-block
            position: absolute
            line-height: 32px
            top: 0
            left: 50%
            transform: translate3d(-50%, 0, 0)
            font-size: $font-size-medium
        .play-list
          line-height: 40px
          width: 40px
          text-align: center
          font-size: $font-size-large-x
          height: 40px
          i
            display: inline-block
            vertical-align: middle

  .full_transition-enter-active, .full_transition-leave-active
    transition: all 1s
    .top, .bottom
      transition: all 1s

  .full_transition-enter, .full_transition-leave-to
    opacity: 0
    .top
      transform: translateX(-100%)
    .middle
      /*opacity: 0.1*/
    .bottom
      transform: translateX(100%)

  .mini-transition-enter-active, .mini-transition-leave-active
    transition: all 1s

  .mini-transition-enter, .mini-transition-leave-to
    transform: translateY(100%)

  .player-leave-active
    transition: all 1s

  .player-leave-to
    transform: translateY(100%)

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
