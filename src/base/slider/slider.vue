<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(dot,index) in dots" :class="{'active':currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      interval: {
        type: Number,
        default: 5000,
      }
    },
    data() {
      return {
        dots: 0,
        currentPageIndex: 0
      };
    },
    computed: {},
    mounted() {
      this._setSliderWidth();
      this._initDots();
      this._initScroll();
      this._play();

      // 监听窗口大小变化
      window.addEventListener("resize", () => {
        if (!this.scroll) return;

        // 重新设置img的宽度
        this._setSliderWidth(true);

        // 大小变化后轮播动画失效了,需要重新设置
        this._play();
      });
    },
    destroyed() {
      clearTimeout(this.timer);
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        /* if (!this.children.length) {
           setTimeout(() => {
             this._setSliderWidth();
           }, 50);
           return;
         }*/

        // 获取宽度
        let sliderWidth = this.$refs.slider.clientWidth;

        // 获取所有img的总宽度
        let groupWidth = sliderWidth * this.children.length;

        // 设置img的宽度
        for (let item of this.children) {
          item.style.width = sliderWidth + 'px';
        }

        // 如果设置为循环播放,并且不是触发页面宽度变化,设置img总宽度加2个img宽度
        if (this.loop && !isResize) {
          groupWidth += 2 * sliderWidth
        }

        // 设置img总宽度
        this.$refs.sliderGroup.style.width = groupWidth + 'px';
      },
      _initDots() {
        this.dots = this.children.length;
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.slider, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,//惯性
          // observeDOM: false,
          snap: {
            threshold: 0.3,//可滚动到下一个的阈值
            loop: this.loop,
            speed: 800
          }
        });

        // 滚动完毕触发事件
        this.scroll.on('scrollEnd', () => {
          //获取当前显示的img的index
          let pageIndex = this.scroll.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex;
          this._play();
        })
      },
      stop() {
        // 正在滚动的时候切换选项卡，会导致当前图片的index和点不对应
        let pageIndex = this.scroll.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
      },
      _play() {
        if (!this.autoPlay) return;

        // 清理同一个timeout
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // let index = this.currentPageIndex;
          // this.scroll.goToPage(index < (this.children.length - 3) ? index + 1 : 0, 0, 400);
          this.scroll.next(3000);
        }, this.interval);
      },

    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    /*max-height: 600px*/
    overflow: hidden
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        /*display inline //不能用这个，否则会图片大小不齐*/
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
          img
            display: block
            width: 100%
            // height: 100%
    .dots
      position: absolute
      left: 0
      right: 0
      bottom: 20px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: white
        &.active
          width: 16px
          border-radius: 4px

</style>
