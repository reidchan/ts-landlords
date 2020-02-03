<template>
  <div id="app" :style="screenStyle">
    <router-view/>
  </div>
</template>

<script>
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

export default {
  computed: {
    screenStyle () {
      return {
        width: screenHeight + 'px',
        height: screenWidth + 'px',
        transform:  `rotate(90deg) translate(${(screenHeight - screenWidth) / 2}px, ${(screenHeight - screenWidth) / 2}px)`,
        'transform-origin': 'center center',
        '-webkit-transform-origin': 'center center',
        'overflow': 'hidden'
      };
    }
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
</style>
