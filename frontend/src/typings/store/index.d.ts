/// <reference path="./user.d.ts" />

interface VueStore {
  readonly state: VueStoreState
  readonly getters: any;
  dispatch: Dispatch
  commit: Commit
}

interface VueStoreState {
  user: UserStore.Store
}

interface Dispatch {
  (type: string, payload?: any, options?: DispatchOptions): Promise<any>;
}

interface Commit {
  (type: string, payload?: any, options?: CommitOptions): void;
}

interface DispatchOptions {
  root?: boolean;
}

interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}