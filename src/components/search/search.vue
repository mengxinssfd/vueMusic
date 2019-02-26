<template>
  <div class="search" ref="search" :style="dialogShowFlag?'z-index:30;':''">
    <div class="search-block">
      <search-box ref="searchBox" @query="onQuery"></search-box>
    </div>
    <scroll class="scroll">
      <div>
        <div class="hot-key">
          <div class="title">热门搜索</div>
          <div class="hot-key-content">
            <span class="hot-key-item" v-for="item in hotKey.slice(0,10)" @click="clickHotKey(item)">{{item.k}}</span>
          </div>
        </div>
        <div class="search-history">
          <div class="title">
            <span>搜索历史</span>
            <span class="clear icon-bin" :class="{'disable':searchHistory.length === 0}" @click="clickClear"></span>
          </div>
          <ul>
            <li class="history-item" v-for="item in searchHistory" @click="clickHistoryItem(item)">
              <span>{{item}}</span>
              <span class="delete icon-cross" @click.stop="clickDelete(item)"></span>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="suggest-wrapper">
      <suggest :queryWord="queryWord" @addHistory="onAddHistory"></suggest>
    </div>
    <i-dialog v-show="dialogShowFlag" :dialog="dialog" @closeDialog="dialogShowFlag = false"></i-dialog>
  </div>
</template>

<script>
  import {getHotKey} from "../../api/search";
  import {ERR_OK} from "../../api/config";
  import SearchBox from 'base/search-box/search-box';
  import suggest from '../suggest/suggest';
  import {playListMixin} from "../../common/js/mixin";
  import {mapActions, mapGetters} from 'vuex';
  import scroll from 'base/scroll/scroll';
  import Dialog from 'base/dialog/dialog';

  // let fromURL = '';

  export default {
    // beforeRouteEnter(to, from, next) {
    //   fromURL = from.path;
    //   console.log(fromURL);
    //   next();
    // },
    mixins: [playListMixin],
    components: {
      SearchBox,
      suggest,
      scroll,
      iDialog: Dialog,
    },
    data() {
      return {
        hotKey: [],
        queryWord: '',
        dialogShowFlag: false,
        dialog: {
          content: '是否清空搜索历史?',
          yes: '清空',
          no: '取消',
          yesHandler: null
        }
      };
    },
    created() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey;
        }
      });
    },
    computed: {
      ...mapGetters(['searchHistory'])
    },
    methods: {
      ...mapActions(['addHistory', 'clearHistory', 'updateHistory']),
      handlePlayList(playList) {
        this.$refs.search.style.bottom = playList.length > 0 ? '60px' : '';
      },
      clickHotKey(hotkey) {
        this.$refs.searchBox.setInputContent(hotkey.k.trim());
      },
      clickHistoryItem(text) {
        this.$refs.searchBox.setInputContent(text);
      },
      clickClear() {
        // if (this.searchHistory.length === 0) return;
        this.dialogShowFlag = true;
        this.dialog.yesHandler = () => {
          this.clearHistory();
        }
      },
      clickDelete(text) {
        this.updateHistory(text);
      },
      onQuery(text) {
        this.queryWord = text;
      },
      onAddHistory(word) {
        this.addHistory(word);
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .search
    position: fixed
    top: 88px
    bottom: 0
    left: 0
    right: 0
    .search-block
      width: 100%
      box-sizing: border-box
      padding: 10px
    .scroll
      position: absolute
      top: 60px
      bottom: 0
      left: 0
      right: 0
      overflow: hidden
    .hot-key
      padding: 10px
      .hot-key-content
        .hot-key-item
          display: inline-block
          margin-right: 10px
          margin-bottom: 4px
          padding: 4px 6px
          border: 1px solid $color-text-d
          border-radius: 6px
          font-size: $font-size-small
          color: $color-text-d
    .search-history
      padding: 10px
      .title
        .clear
          display: inline-block
          padding-left: 10px
          font-size: $font-size-medium-x
          float: right
          &.disable
            color: $color-text-l
            pointer-events: none
      .history-item
        padding: 14px 0
        color: $color-text
        font-size: $font-size-medium
        .delete
          padding-right:2px
          display: inline-block
          padding-left: 10px
          float: right
          font-size: 12px

  .title
    margin-bottom: 10px
    font-size: $font-size-medium-x
    color: $color-theme
</style>
