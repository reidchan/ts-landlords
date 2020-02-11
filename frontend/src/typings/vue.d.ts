/// <reference path="./request.d.ts"/>

import Vue, { ComponentOptions } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $store: VueStore;
    $http: HttpRequest;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: VueStore;
  }
}