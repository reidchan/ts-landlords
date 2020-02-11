import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false;

const vueStore = store as any;

new Vue({
  router,
  store: vueStore,
  render: (h) => h(App),
}).$mount('#app');
