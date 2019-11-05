<template>
  <div class="room">
    <div class="top">
    </div>
    <div class="middle">
      <div class="p1">
      </div>
      <div class="show">
      </div>
      <div class="p2">
      </div>
    </div>
    <div class="bottom">
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"/>

<style scoped lang="less">
.room {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .top {
    flex: 2;
    background: yellow;
  }
  .middle {
    flex: 5;
    width: 100%;
    height: 100%;
    display: flex;
    .p1 {
      flex: 1;
      background: red;
    }
    .show {
      flex: 1;
      background: blue;
    }
    .p2 {
      flex: 1;
      background: purple;
    }
  }
  .bottom {
    flex: 4;
    background: green;
  }
}
</style>
