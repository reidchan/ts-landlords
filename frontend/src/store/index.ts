import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';

const vuex: VueStore = new Vuex.Store({
  modules: {
    user
  },
}) as any;

export default vuex;
