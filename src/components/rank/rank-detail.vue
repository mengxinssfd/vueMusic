<template>
  <transition name="hide">
    <music-list
      v-if="songs.length > 0"
      :avatar="songs[0].image"
      :title="rankInfo.name"
      :songs="songs">
    </music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import {getRankDetail} from "../../api/rank";
  import {createSong} from "../../common/js/song";
  import {ERR_OK} from "../../api/config";
  import {mapGetters} from 'vuex';

  export default {
    components: {
      MusicList
    },
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['rankInfo']),
    },
    created() {
      // let id = this.$router.currentRoute.params.id;
      let id = this.rankInfo.id;
      if (!id) {
        this.$router.push('/rank');
      } else {
        getRankDetail(id, this.rankInfo.date, this.rankInfo.type).then((res) => {
          if (res.code === ERR_OK) {
            for (let song of res.songlist) {
              if (song.data.interval > 0) {
                this.songs.push(createSong(song.data));
              }
            }
          }
        });
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .hide-enter-active, .hide-leave-active
    transition: all .5s

  .hide-enter, .hide-leave-to
    transform: translateX(-100%)
</style>
