<template>
  <div class="poker-card">
    <img :src="require(`@/assets/img/poker/${card.imgUrl}.jpg`)"/>
  </div>
</template>

<script src="./index.ts" lang="ts"/>

<style scoped lang="less">
@import url('./index.less');
</style>