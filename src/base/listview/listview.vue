<template>
  <div class="listview" ref="listview">
    <div class="index-list" @touchmove="onTouchMove" ref="indexList">
      <ul>
        <li v-for="(item,index) in singerList" class="item"
            @click="onTouchStart(index)" :class="{current:currentPageIndex == index}">
          <!--@touchstart="onTouchStart(index)"-->
          <span>{{item.title}}</span>
        </li>
      </ul>
    </div>
    <scroll class="list-group" :listen-scroll="true" :probe-type="3" ref="scroll" @scroll="_onScroll">
      <ul ref="listGroup">
        <li class="list-group-item" v-for="singers in singerList">
          <h1 class="title">{{singers.title}}</h1>
          <ul>
            <li v-for="singer in singers.items" class="singer-item" @click="click(singer)">
              <img v-lazy="singer.avatar" width="28" alt="">
              <span class="name">{{singer.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="title-fixed" v-show="currentTitle" ref="titleFixed">
      <h1 class="title">{{currentTitle}}</h1>
    </div>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll';
  import {getSongList} from "../../api/singer";
  import 'vue-lazyload';
  import {playListMixin} from "../../common/js/mixin";

  export default {
    mixins: [playListMixin],
    props: {
      singerList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        currentPageIndex: 0,
        listenScroll: true,
        currentTitle: '热',
        scrollY: 0
      };
    },
    components: {
      scroll
    },
    watch: {
      scrollY(newY) {

        if (!this.heights) {
          this._getHeights();
        }
        let y = -newY;
        if (y < 0) {
          this.currentTitle = '';
        }

        this._getCurrentIndex(y);

        this._diff(y);
      },
    },
    methods: {
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : '';
        this.$refs.listview.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      onTouchStart(index) {
        this._scrollTo(index);
      },
      onTouchMove(e) {
        let firstTouch = e.touches[0];
        let touchY = firstTouch.pageY;

        let li = this.$refs.indexList.getElementsByTagName('li');
        let hot = li[0];
        let hotTop = hot.getBoundingClientRect().top;

        let itemHeight = 15;
        let index = parseInt((touchY - hotTop) / 15);

        if (index >= 0 && index < li.length) {
          this._scrollTo(index);
        }
      },
      _scrollTo(index) {
        if (index === this.currentPageIndex) return;
        let el = this.$refs.listGroup.getElementsByClassName('list-group-item')[index];
        this.$refs.scroll.scrollToElement(el);

        if (!this.heights) {
          this._getHeights();
        }
        let viewHeight = this.$refs.listview.clientHeight;
        let thisEnd = this.heights[index + 1];
        let thisStart = this.heights[index];
        let y = ((index === this.heights.length - 2) && (thisEnd - thisStart) < viewHeight) ? thisEnd - viewHeight : thisStart;
        this.scrollY = -y;
      },
      _getHeights() {// 获得歌手列表全部分类的高度
        if (!this.$refs.listGroup) return;
        let items = this.$refs.listGroup.getElementsByClassName('list-group-item');
        let heights = [0];
        let height = 0;
        for (let item of items) {
          height += item.clientHeight;
          heights.push(height);
        }
        this.heights = heights;
      },
      _onScroll(pos) {
        this.scrollY = pos.y;
      },
      _getCurrentIndex(y) {
        for (let i = this.heights.length - 2; i >= 0; i--) {
          let height = this.heights[i];
          if (y >= height) {
            this.currentPageIndex = i;
            this.currentTitle = this.singerList[i].title;
            return i;
          }
        }
      },
      _diff(y) {
        // 下一个类别的开始位置减去当前的y坐标，如果小于title的高度，用title的高度减去这个高度，把固定位置的title顶上去
        let index = this.currentPageIndex;
        let distance = this.heights[index + 1] - y;
        const TITLE_HEIGHT = 30;
        let move = (0 < distance && distance < TITLE_HEIGHT) ? (TITLE_HEIGHT - distance) : 0;
        this.$refs.titleFixed.style.transform = 'translate3d(0,-' + move + 'px,0)';
      },
      click(singer) {
        // getSongList(id);
        this.$emit('select', singer);
      },
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  *
    touch-action: none

  .listview
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    overflow: hidden
    .index-list
      position: absolute
      top: 50%
      right: 0
      width: 20px
      transform: translateY(-50%)
      z-index: 10
      text-align: center
      padding: 20px 0
      border-radius: 10px
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        //font-size: $font-size-small-s
        font-size: 8px
        &.current
          color: $color-theme
    .title-fixed
      position: absolute
      left: 0
      top: -1px
      width: 100%
      z-index: 5
      .title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .list-group
      height: 100%
      overflow: hidden
      .singer-item
        padding: 10px
      .title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .singer-item
        img
          display: inline-block
          vertical-align: top
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          line-height: 50px
          color: $color-text-l
          font-size: $font-size-medium
</style>
