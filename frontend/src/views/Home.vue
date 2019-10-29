<template>
  <div class="home">
    <Room/>
  </div>
</template>

<script>
import Room from '@/components/Room/index.vue'

export default {
  name: 'home',
  components: {
    Room
  }
}
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
}
</style>