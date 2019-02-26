<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {debounce} from "../../common/js/util";

  export default {
    props: {
      /* probeType: {
         type: Number,
         default: 1
       },*/
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this._initScroll();
    },
    methods: {
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollToElement(index, duration = 0) {
        this.scroll && this.scroll.scrollToElement(index, duration);
      },
      scrollTo({x = 0, y = 0, time = 0}) {
        this.scroll && this.scroll.scrollTo(x, y, time);
      },
      scrollBy({x = 0, y = 0, time = 0}) {
        this.scroll && this.scroll.scrollBy(x, y, time);
      },
      _initScroll() {
        // if (!this.$refs.scroll) return;
        this.scroll = new BScroll(this.$refs.scroll, {
          // probeType: this.probeType,
          probeType: this.listenScroll ? 3 : 1,
          click: this.click,
          scrollbar:{
            fade:true,
            interactive: false
          }
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos);
          });
        }

        if (this.pullUp) {
          let timeout = debounce((pos) => {
            if (pos.y <= (this.scroll.maxScrollY)) {
              this.$emit('end');
            }
          }, 1000);
          this.scroll.on('scrollEnd', timeout);
        }
      },

    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
