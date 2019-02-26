<template>
  <div class="suggest" v-if="queryWord">
    <scroll ref="scroll" class="suggest-list" :pullUp="true" @end="onEnd">
      <div>
        <div class="singer" v-if="zhida && zhida.singer"
             @click="clickSinger(zhida.singer)">
          <img width="50" height="50" :src="zhida.singer.avatar" @error="onImgLoadError" alt="">
          <div class="name">
            {{zhida.singer.name}}
          </div>
        </div>
        <song-list v-if="suggestList.length>0" :songs="suggestList" @selectSong="onSelectSong"></song-list>
        <div class="loading-wrapper">
          <loading v-if="!hasLoadAll" :content="'搜索中...'"></loading>
          <div v-else>我可是有底线的...</div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import {mapMutations, mapActions} from 'vuex';
  import * as types from "../../store/mutation-type";
  import {getSearch} from "../../api/search";
  import Singer from 'common/js/singer';
  import {createSongFromSearch} from "../../common/js/song";
  import {ERR_OK} from "../../api/config";
  import loading from 'base/loading/loading';
  import img from 'common/images/default.jpg';

  const TYPE_SINGER = 1;
  const TYPE_ALBUM = 2;
  export default {
    props: {
      queryWord: {
        type: String,
        default: ''
      },
    },
    components: {
      scroll,
      SongList,
      loading
    },
    data() {
      return {
        page: 1,
        suggestList: [],
        zhida: {},
        hasLoadAll: false
      };
    },
    created() {
    },
    watch: {
      queryWord(newValue, oldValue) {
        this.suggestList = [];
        this.zhida = {};
        this.hasLoadAll = false;
        if (newValue) {
          this.page = 1;
          this.search(newValue);
        }
      },

    },
    methods: {
      ...mapMutations({
        setSinger: types.SET_SINGER,
        setPlayList: types.SET_PLAYLIST,
        setCurrentIndex: types.SET_CURRENTINDEX
      }),
      ...mapActions(['selectSongs']),
      clickSinger(singer) {
        this.setSinger(singer);
        this.emit();
        this.$router.push('/search/' + this.zhida.singer.mid);
      },
      onSelectSong(song) {
        this.selectSongs({songs: [song], index: 0});
        this.emit();
      },
      emit() {
        this.$emit('addHistory', this.queryWord);
      },
      search(text) {
        getSearch(text, this.page, 1).then((res) => {
          if (res.code === ERR_OK) {
            this.filterData(res.data);
          }
        });
      },
      filterData(data) {
        let zhida = data.zhida;
        if (zhida.type === TYPE_SINGER && !this.zhida.singer) {
          this.zhida.singer = new Singer(zhida.zhida_singer.singerID, zhida.zhida_singer.singerMID, zhida.zhida_singer.singerName);
        }
        if (data.song.list.length === 0 || data.song.curnum < 20) {
          this.hasLoadAll = true;
        }
        for (let song of data.song.list) {
          if (song.interval > 0) {
            this.suggestList.push(createSongFromSearch(song));
          }
          for (let subSong of song.grp) {
            if (subSong.interval > 0) {
              this.suggestList.push(createSongFromSearch(subSong));
            }
          }
        }
        this.$refs.scroll.refresh();
      },
      onEnd() {
        if (!this.hasLoadAll) {
          this.page++;
          this.search(this.queryWord);
        }
      },
      onImgLoadError(event) {
        event.target.src = img;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .suggest
    position: absolute
    top: 57px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: $color-background
    .suggest-list
      height: 100%
      .singer
        display: flex
        align-items: center
        font-size: $font-size-medium
        color: $color-text
        padding: 10px 30px
        & > img
          flex: 0 0 50px
          border-radius: 50%
          display: inline-block
          /*background: url("/static/images/default.jpg")*/
          /*background-size: 50px*/
        .name
          flex: 1
          display: inline-block
          margin-left: 20px
      .loading-wrapper
        height: 50px
        text-align: center
        font-size: $font-size-medium
</style>
