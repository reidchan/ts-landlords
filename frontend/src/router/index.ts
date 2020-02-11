import Vue from 'vue';
import VueRouter from 'vue-router';
import Room from '../views/room/index.vue';
import Hall from '../views/hall/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/hall',
    name: 'hall',
    component: Hall,
  }, {
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
