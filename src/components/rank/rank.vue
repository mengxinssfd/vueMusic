<template>
  <div class="rank" ref="rank">
    <div class="scroll-wrapper">
      <scroll ref="scroll" class="rank-list">
        <div>
          <div class="rank-group" v-for="group in rankGroup">
            <h1 class="group-name">{{group.GroupName}}</h1>
            <div class="list-item" v-for="list in group.List" @click="click(list)" v-if="isMV(list)">
              <div class="left"><img width="100%" height="100%" v-lazy="list.pic_v12" alt=""></div>
              <div class="right">
                <div style="display:none">{{list.ListName}}</div>
                <ul>
                  <li class="top4" v-for="(song,index) in list.songlist">
                    <span>{{index+1}}</span><span>{{song.singername}}</span>- <span>{{song.songname}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <loading v-if="rankGroup.length === 0"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll';
  import {playListMixin} from "../../common/js/mixin";
  import {getRank} from "../../api/rank";
  import {mapMutations} from 'vuex';
  import {SET_RANKINFO} from "../../store/mutation-type";
  import lazy from 'vue-lazyload';
  import loading from 'base/loading/loading';

  export default {
    mixins: [playListMixin],
    components: {
      scroll,
      loading
    },
    data() {
      return {
        rankGroup: []
      }
    },
    created() {
      getRank().then((res) => {
        this.rankGroup = res;
      });
    },
    methods: {
      ...mapMutations({setRankInfo: SET_RANKINFO}),
      handlePlayList(playList) {
        this.$refs.rank.style.bottom = playList.length > 0 ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      isMV(list) {
        let flag = /MV/.test(list.ListName);
        return !flag;
      },
      click(list) {
        let id = list.topID;
        this.setRankInfo({
          id,
          name: list.ListName,
          avatar: list.pic_v12,
          date: list.update_key,
          type: list.type !== 0 ? 'global' : 'top'
        });
        this.$router.push({
          path: '/rank/' + id
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .rank
    position: fixed
    top: 88px
    width: 100%
    bottom: 0
    .scroll-wrapper
      height: 100%
      box-sizing: border-box
      padding: 10px
      overflow: hidden
      .rank-list
        height: 100%
        .rank-group
          .group-name
            text-align: center
            margin-bottom: 10px
        .list-item
          display: flex
          align-items: center
          margin-bottom: 10px
          border-radius: 5px
          //color: $color-text
          background: $color-background-d
          //background: linear-gradient(top, #a99598, #8c98ab)
          overflow: hidden
          .left
            flex: 0 0 100px
            width: 100px
            height: 100px
          .right
            display: block
            flex: 1
            padding: 10px
            overflow: hidden
            .top4
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              font-size: $font-size-medium
              line-height: $font-size-large
              color: $color-text
              /*margin-bottom: 2px*/
              span
                margin-right: 4px
      .loading
        position: absolute
        top: 50%
        transition: translateY(-50%)
</style>
