<template>
  <transition name="slide" @after-leave="afterLeave">
    <music-list :avatar="singerFromPlayer.avatar" :title="singerFromPlayer.name" :songs="songs" :hasLoadAll="hasLoadAll"
                @end="onEnd" @randPlayAll="onRandPlayAll"></music-list>
  </transition>
</template>

<script>
  import SingerDetail from '../singerdetail/singerdetail';
  // 子组件不会继承template
  let fromURL = '';
  let PER_PAGE_COUNT = 30;
  export default {
    extends: SingerDetail,
    props: {
      singerFromPlayer: {
        type: Object,
        default: {}
      }
    },
    watch: {
      singer(newValue) {
        console.log(newValue);
      }
    },
    methods: {
      _getSongList() {
        if (!this.singerFromPlayer.mid) {
          this.closeDetail(false);
        } else {
          this.getSongs(this.singerFromPlayer.mid, this.songs.length, PER_PAGE_COUNT, null);
        }
      },
      onRandPlayAll() {
        let start = 0;
        let count = this.total;
        getSongList(this.singerFromPlayer.mid, start, count).then((res) => {
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

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
