import Vue from 'vue';
import VueRouter from 'vue-router';
import Room from '../views/Room/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/room',
    name: 'room',
    component: Room,
  }
];

// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
