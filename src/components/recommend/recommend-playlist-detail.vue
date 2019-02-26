<template>
  <transition name="slide">
    <music-list v-if="songs && info" :avatar="info.avatar" :title="info.title" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import {getRecommendPlayListDetail} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../common/js/song";

  export default {
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        info: {},
        songs: []
      }
    },
    components: {
      MusicList
    },
    created() {
      let id = this.$router.currentRoute.params.id;
      if (!id) {
        this.$router.push('/recommend');
      }
      getRecommendPlayListDetail(id).then((res) => {
        if (res.code === ERR_OK) {
          let cdlist = res.cdlist[0];
          this.info = {avatar: cdlist.logo, title: cdlist.dissname};
          for (let song of cdlist.songlist) {
            if (song.interval > 0) {
              this.songs.push(createSong(song));
            }
          }
        }
      });
    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all .5s

  .slide-enter, .slide-leave-to
    transform: translateX(-100%)
</style>
