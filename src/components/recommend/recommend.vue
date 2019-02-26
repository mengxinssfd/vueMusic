<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :pullUp="true" @end="onEnd">
      <div>
        <div class="slider-wrapper">
          <slider v-if="recommends.length" ref="slider">
            <div v-for="item in recommends" class="slider-item">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="disc">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in disc" class="item" @click="clickItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" style="display:block;" width="60">
              </div>
              <div class="text">
                <h2 class="title">{{item.dissname}}</h2>
                <span class="name">{{item.creator.name}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="loadall-loading">
          <loading v-if="!hasLoadAll" :content="'加载中'"></loading>
          <div v-else>我可是有底线的...</div>
        </div>
      </div>
    </scroll>
    <router-view :id="playlist_detail_id"></router-view>
  </div>
</template>

<script>
  import {getRecommend, getDiscList} from '../../api/recommend';
  import {ERR_OK} from "api/config";
  import slider from 'base/slider/slider';
  import BScroll from 'better-scroll';
  import loading from 'base/loading/loading';
  import scroll from 'base/scroll/scroll';
  import {playListMixin} from "../../common/js/mixin";
  import {mapMutations} from 'vuex';
  import {SET_SINGER} from "../../store/mutation-type";

  const LENGTH = 30;

  export default {
    mixins: [playListMixin],
    data() {
      return {
        recommends: [],
        disc: [],
        playlist_detail_id: '',
        hasLoadAll: false
      }
    },
    components: {
      slider,
      loading,
      scroll
    },
    mounted() {
      this._getRecommend();
      this._getDiscList();
      // this.scroll = new BScroll(this.$refs.recommend, {click: true});
    },
    // 加了keep-alive后的钩子函数
    activated() {
      this.loadImg();
      this.$refs.slider && this.$refs.slider._play();
    },
    deactivated() {
      this.$refs.slider.stop();
    },
    methods: {
      ...mapMutations({setSinger: SET_SINGER}),
      handlePlayList(playList) {
        this.$refs.recommend.style.bottom = playList.length > 0 ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        });
      },
      _getDiscList() {
        let start = this.disc.length > 0 ? this.disc.length : 0;
        let end = this.disc.length > 0 ? this.disc.length + LENGTH - 1 : LENGTH - 1;
        getDiscList(start, end).then((res) => {
          if (res.code === ERR_OK) {
            this.disc = this.disc.concat(res.data.list);
            if (res.data.list.length < LENGTH) {
              this.hasLoadAll = true;
            }
          }
        });

      },
      loadImg() {
        this.$refs.scroll.refresh();
      },
      clickItem(item) {
        this.playlist_detail_id = item.dissid;
        // this.setSinger(new Creater(item.dissid, item.dissname, item.imgurl));
        this.$router.push({
          path: '/recommend/' + this.playlist_detail_id
        });
      },
      onEnd() {
        if (!this.hasLoadAll) {
          this._getDiscList();
        }
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        overflow: hidden
        width: 100%
      .loadall-loading
        height: 50px
        text-align: center
        font-size: $font-size-medium
      .disc
        width: 100%
        .list-title
          text-align: center
          line-height: 38px
          background: $color-background-d
          font-size: $font-size-medium
        .item
          display: flex
          align-items: center
          padding: 10px
          .icon
            flex: 0 0 60px
            display: inline-block
            vertical-align: top
            margin-right: 12px
          .text
            flex: 1
            display inline-block
            color: white
            .title
              font-size: $font-size-small
              color: $color-text
            .name
              font-size: 12px
              color: $color-dialog-background

</style>
