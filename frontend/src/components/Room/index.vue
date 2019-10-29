<template>
  <div class="room">
    <div class="top">
    </div>
    <div class="bottom">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Room extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped lang="less">
.room {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .top {
    flex: 1;
    background: red;
  }
}
</style>
