<template>
  <transition name="slide" @after-leave="afterLeave">
    <music-list
      :avatar="singer.avatar"
      :title="singer.name"
      :songs="songs"
      :hasLoadAll="hasLoadAll"
      @end="onEnd"
      @randPlayAll="onRandPlayAll"
    ></music-list>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {getSongList} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {createSong} from '../../common/js/song';
  import MusicList from '../music-list/music-list';
  import Singer from "../../common/js/singer";
  import * as types from "../../store/mutation-type";
  import {playMode} from "../../store/config";

  let fromURL = '';
  let PER_PAGE_COUNT = 30;
  export default {
    beforeRouteEnter(to, from, next) { // 获取来自的url
      fromURL = from.path;
      // console.log(fromURL);
      next();
    },
    data() {
      return {
        songs: [],
        hasLoadAll: false,
        total: -1
      };
    },
    components: {
      MusicList
    },
    created() {
      // let path = window.location.pathname;
      // path = path.split('/').pop();
      // console.log(path);
      this._getSongList();
    },
    watch: {
      singer(newValue) {
        if (!newValue) return;
        this.songs = [];
        this.tatal = -1;
        this.getSongs(newValue.mid, this.songs.length, PER_PAGE_COUNT, null);
      }
    },
    computed: {
      ...mapGetters(['singer', 'sequenceList']),
    },
    methods: {
      ...mapMutations({
        setSinger: types.SET_SINGER,
        playListPush: types.PLAYLIST_PUSH,
        setPlayMode: types.SET_MODE,
        closeDetail: types.SET_SHOW_PLAYER_SINGER_DETAIL,// 给子组件用
      }),
      ...mapActions(['selectSongs']),
      _getSongList() {
        // 如果vuex里有singer则从vuex里获得id，没有则从url里获取id，url里没有则返回
        if (!this.singer.id) {
          let id = this.$router.currentRoute.params.id;
          if (!id) {
            console.log('test');
            this.$router.push(fromURL);
          } else {
            this.getSongs(id, this.songs.length, PER_PAGE_COUNT, (data) => {
              // state里没有singer添加一个
              this.setSinger(new Singer(data.singer_id, data.singer_mid, data.singer_name));
            });
          }
        } else {
          this.getSongs(this.singer.mid, this.songs.length, PER_PAGE_COUNT, null);
        }

      },
      getSongs(id, start, count, callback) {
        getSongList(id, start, count).then((res) => {
          if (res.code === ERR_OK) {
            this._songsFilter(res);
            if (callback) {
              callback(res.data);
            }
          }
        });
      },
      _songsFilter(res) {
        let newArr = [];
        for (let item of res.data.list) {
          let {musicData} = item;
          if (musicData.interval > 0) {
            newArr.push(createSong(musicData));
          }
        }

        if (this.total < 0) {
          this.total = res.data.total;
        }

        if (res.data.list.length < PER_PAGE_COUNT) {
          this.hasLoadAll = true;
        }

        if (newArr.length === 0) {
          return;
        }

        if (this.songs === this.sequenceList) {
          console.log('同一个list');
          this.playListPush(newArr);
          // playlist已经concat改过了
          this.songs = this.sequenceList;
        } else {
          // console.log('不一个list');
          this.songs = this.songs.concat(newArr);
        }
      },
      afterLeave() {
        /* let path = this.$router.currentRoute.path;
         if (fromURL !== path) {
           this.$router.push(fromURL);
         }*/
      },
      onEnd() {
        if (this.hasLoadAll) return;

        this._getSongList();
      },
      onRandPlayAll() {
        let start = 0;
        let count = this.total;
        getSongList(this.singer.mid, start, count).then((res) => {
          if (res.code === ERR_OK) {
            this._songsFilter(res);

            let songs = [];
            for (let item of res.data.list) {
              let {musicData} = item;
              if (musicData.interval > 0) {
                songs.push(createSong(musicData));
              }
            }

            let index = parseInt(Math.random() * songs.length);
            this.selectSongs({songs, index});
            this.setPlayMode(playMode.random);

            this.songs = this.sequenceList;
          }
        });
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all .5s ease

  .slide-enter, .slide-leave-to
    transform: translateX(-100%)
</style>
