<template>
  <div class="song-list">
    <ul>
      <li class="song-item" v-for="(song,index) in songs" @click="selectSong(song,index,song.payplay)"
          :class="{'need-pay':song.payplay}">
        <div class="order">
          <div v-show="showOrder">
            <i class="icon-trophy" :class="{'first':index === 0,'second':index === 1,'third':index === 2}"
               v-show="index <= 2"></i>
            <span class="number" v-show="index>2">{{index+1}}</span>
          </div>
          <div v-show="!showOrder"><span class="number">{{index+1}}</span></div>
        </div>
        <div class="content">
          <h1 class="title"><span class="has-mv" @click.stop="clickMv(song.vid)" v-if="song.vid">mv</span><span>{{song.name}}</span>
          </h1>
          <div class="desc">
            {{song.singer}} -《{{song.album.name}}》
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {bus, busEvents} from "../bus/bus";
  import {getFileID, getMVVkey} from "../../api/mv";
  import {ERR_OK} from "../../api/config";
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_MVLIST, SET_PLAYING} from "../../store/mutation-type";

  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      showOrder: {
        type: Boolean,
        default: false
      }
    },
    beforeDestory() {
      console.log('beforeDestory')
    },
    computed: {
      ...mapGetters(['playing']),
    },
    methods: {
      ...mapMutations({setMvList: SET_MVLIST, setPlaying: SET_PLAYING}),
      clickMv(vid) {
        // let mvUrl = 'https://y.qq.com/n/yqq/mv/v/' + vid + '.html';
        // window.location = mvUrl;

        getFileID(vid).then((res) => {
          if (res.code === ERR_OK) {
            let fileid = res.getMvInfo.data.mvlist[0].fileid;
            getMVVkey(fileid).then((response) => {
              if (response.code === ERR_OK) {
                let types = [];
                let fileUrlList = response.getMvUrl.data.data[fileid];
                for (let item of fileUrlList) {
                  let temp = [];
                  let vkey = item.vkey;
                  let cn = item.cn;
                  for (let url of item.url) {
                    temp.push(url + cn + '?vkey=' + vkey);
                  }
                  types.push(temp);
                }
                this.setMvList(types);
                if (this.playing) {
                  this.setPlaying(false);
                }
              }
            });
          }
        });
      },
      selectSong(song, index, payplay) {
        if (!payplay) {
          this.$emit('selectSong', song, index)
          bus.$emit(busEvents.play);
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import '~common/stylus/variable.styl'
  .song-list
    /*padding: 24px 24px 0 24px*/
    & > ul
      background: $color-background
    .song-item
      background: $color-background
      display: flex
      align-items: center
      /*padding-bottom: 18px*/
      padding: 18px
      &.need-pay
        .order
          color: $color-text-l
        .content
          .title
            color: $color-text-l
            text-decoration: line-through
      .order
        flex: 0 0 50px
        display: inline-block
        vertical-align: middle
        text-align: center
        width: 50px
        .icon-trophy
          font-size: $font-size-large
          line-height: 30px
          &.first
            color: gold
          &.second
            color: silver
          &.third
            color: #ffc03d
        .number
          line-height: 30px
          font-size: $font-size-medium-x
      .content
        flex: 1
        display: inline-block
        vertical-align: top
        overflow: hidden
        .title
          line-height: $font-size-medium
          font-size: $font-size-medium
          color: $color-text
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          .has-mv
            display: inline-block
            vertical-align: top
            margin-right: 4px
            padding: 0 2px
            color: $color-theme
            font-size: $font-size-small-s
            border: solid 1px $color-theme
            border-radius: 3px
        .desc
          width: 100%
          margin-top: 4px
          color: $color-text-d
          line-height: $font-size-small
          font-size: $font-size-small
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis


</style>
