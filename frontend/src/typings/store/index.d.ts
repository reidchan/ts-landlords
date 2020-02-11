/// <reference path="./user.d.ts" />

interface VueStore {
  state: VueStoreState
}

interface VueStoreState {
  user: UserStore.Store
}