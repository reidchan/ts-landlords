/// <reference path="./store/index.d.ts"/>
import Vue, { ComponentOptions } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $store: VueStore;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $store?: VueStore;
  }
}