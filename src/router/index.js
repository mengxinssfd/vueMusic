import Vue from 'vue';
import Router from 'vue-router';
// import Rank from 'components/rank/rank';
// import Singer from 'components/singer/singer';
import Recommend from 'components/recommend/recommend';
// import RecommendPlayListDetail from 'components/recommend/recommend-playlist-detail';
// import Search from 'components/search/search';
// import SingerDetail from 'components/singerdetail/singerdetail';
// import RankDetail from '../components/rank/rank-detail';
// import User from 'components/user/user';

const Singer = (resolve) => {
  import('components/singer/singer').then((vueFile) => {
    resolve(vueFile);
  });
};
const Rank = (resolve) => {
  import('components/rank/rank').then((vueFile) => {
    resolve(vueFile);
  });
};
const RecommendPlayListDetail = (resolve) => {
  import('components/recommend/recommend-playlist-detail').then((vueFile) => {
    resolve(vueFile);
  });
};
const Search = (resolve) => {
  import('components/search/search').then((vueFile) => {
    resolve(vueFile);
  });
};
const SingerDetail = (resolve) => {
  import('components/singerdetail/singerdetail').then((vueFile) => {
    resolve(vueFile);
  });
};
const User = (resolve) => {
  import('components/user/user').then((vueFile) => {
    resolve(vueFile);
  });
};
const RankDetail = (resolve) => {
  import('../components/rank/rank-detail').then((vueFile) => {
    resolve(vueFile);
  });
};

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  mode: 'history', // 去掉井号
  base: '/vue/',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RankDetail
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: RecommendPlayListDetail
        }
      ]
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '*',
      redirect: '/recommend'
    }
  ]
});
