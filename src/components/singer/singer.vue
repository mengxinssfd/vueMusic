<template>
  <div class="singer">
    <listview :singerList="singerList" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer';
  import Singer from 'common/js/singer';
  import listview from 'base/listview/listview';
  import {mapMutations} from 'vuex';
  import {SET_SINGER} from '@/store/mutation-type';

  const HOT_NAME = '热';
  const HOT_LEN = 10;
  export default {
    data() {
      return {
        singerList: []
      };
    },
    components: {
      listview
    },
    mounted() {
      this._getSingerList();
    },
    methods: {
      ...mapMutations({setSinger: SET_SINGER}),// ...为spread/rest运算符，赋值时扩展，被赋值时合并
      _getSingerList() {
        getSingerList().then((res) => {
          this.singerList = this.listFilter(res.data.list);
        });
      },
      listFilter(originalList) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        originalList.forEach((item, index) => {
          let id = item.Fsinger_id;
          let mid = item.Fsinger_mid;
          let name = item.Fsinger_name;
          let key = item.Findex;

          //前十加到hot里去
          if (index < HOT_LEN) {
            map.hot.items.push(new Singer(id, mid, name));
          }

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }

          map[key].items.push(new Singer(id, mid, name));
        });

        let list = [];
        for (let key in map) {
          if ((/[a-zA-Z]/).test(key)) {
            list.push(map[key]);
          }
        }
        list.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        list.unshift(list.pop());

        let index = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].title === 'Y') {
            index = i;
            break;
          }
        }
        let temp = list.splice(index, 1);
        list.push(temp[0]);
        return list;
      },
      selectSinger(singer) {
        this.$router.push({
          path: '/singer/' + singer.mid
        });
        this.setSinger(singer);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .singer
    width: 100%
</style>
