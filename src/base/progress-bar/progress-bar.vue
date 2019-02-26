<template>
  <div class="progress-bar">
    <div class="bar-inner" ref="barInner" @click.stop.prevent="clickBar">
      <div class="progress"
           :style="barWidth"
           @touchstart.stop.prevent="touchStart"
           @touchmove.stop.prevent="touchMove"
           @touchend.stop.prevent="touchEnd">
        <div class="progress-btn-wrapper">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }

    },
    data() {
      return {
        barWidth: 'width:0%;'
      };
    },
    watch: {
      percent(newPer) {
        if (!this.touch.isTouch) {
          this.barWidth = 'width:' + newPer + '%;';
        }
      }
    },
    created() {
      this.touch = {};
    },
    methods: {
      _getPercent(pageX) {
        let bar = this.$refs.barInner;
        let {left, width} = bar.getBoundingClientRect();//移动端没有x
        return ((pageX - left) / width).toFixed(2);
      },
      clickBar(event) {
        let percent = this._getPercent(event.pageX);
        this.$emit('changeBar', Math.min(percent, 1));
      },
      touchStart(event) {
        let pageX = event.touches[0].pageX;
        this.touch.percent = this._getPercent(pageX);
        this.touch.isTouch = true;
      },
      touchMove(event) {
        let pageX = event.touches[0].pageX;
        let percent = this._getPercent(pageX);
        this.touch.percent = percent;
        this._setBarWidth(percent);
      },
      touchEnd(event) {
        this.touch.isTouch = false;
        this.$emit('changeBar', Math.min(this.touch.percent, 1));
      },
      _setBarWidth(percent) {
        this.barWidth = `width:${percent * 100}%;`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .progress-bar
    height: 2px
    font-size: 0
    .bar-inner
      width: 100%
      height: 2px
      background: rgba(0, 0, 0, 0.4)
      & > .progress
        position: relative
        height: 100%
        background: #ff1c80
        & > .progress-btn-wrapper
          position: absolute
          right: 0
          top: 50%
          transform: translate3d(50%, -50%, 0)
          width: 12px
          height: 12px
          & > .progress-btn
            width: 100%
            height: 100%
            background #77b7ff
            border-radius: 50%


</style>
