<template>
  <div id="app" :style="screenStyle">
    <div class="mask" v-show="reqCount > 0">
      <van-loading color="white"/>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Loading } from 'vant';

import GlobalStore from '@/store/global';

const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

@Component({
  components: {
    Loading
  },
})
export default class App extends Vue {

  public get screenStyle () {
    return {
      width: screenHeight + 'px',
      height: screenWidth + 'px',
      transform:  `rotate(90deg) translate(${(screenHeight - screenWidth) / 2}px, ${(screenHeight - screenWidth) / 2}px)`,
      'transform-origin': 'center center',
      '-webkit-transform-origin': 'center center',
      'overflow': 'hidden'
    };
  }

  public get reqCount() {
    return GlobalStore.reqCount;
  }

  public get isOverlayShow() {
    return true;
  }

  public created() {
  }

}
</script>

<style lang="less">
html, body {
  width: 100%;
  height: 100%;
}
html, body, #app, p {
  padding: 0;
  margin: 0;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  .van-loading {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
