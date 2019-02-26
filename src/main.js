// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// import fastclick from 'fastclick';
// cnpm install stylus-loader css-loader style-loader --save-dev
import 'common/stylus/index.styl';
import lazyload from 'vue-lazyload';
import store from './store/index';

// require('common/js/vconsole');
/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole';

Vue.config.productionTip = false;

// 移动端网页需要等300毫秒判断是否有双击
// fastclick.attach(document.body);

// 图片懒加载
Vue.use(lazyload, {
  loading: require('common/images/default.jpg'),
  throttleWait: 20
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
});
