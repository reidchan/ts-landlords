<template>
  <div class="room">
    <div class="top">
    </div>
    <div class="middle">
      <div class="p1">
        <div class="figure">
          <img class="avatar" src="@/assets/img/figure/farmer.png"/>
          <div class="message">
            <p>{{ player1.name }}</p>
          </div>
        </div>
        <div class="card">
          <img class="poker" src="@/assets/img/poker/back.png"/>
          <p class="count">{{ player1.cards.length }}</p>
        </div>
        <div class="empty"></div>
      </div>
      <div class="show">
      </div>
      <div class="p2">
        <div class="empty"></div>
        <div class="card">
          <img class="poker" src="@/assets/img/poker/back.png"/>
          <p class="count">{{ player2.cards.length }}</p>
        </div>
        <div class="figure">
          <img class="avatar" src="@/assets/img/figure/farmer.png"/>
          <div class="message">
            <p>{{ player2.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="figure">
        <img class="avatar" src="@/assets/img/figure/farmer.png"/>
        <div class="message">
          <p>{{ playerMe.name }}</p>
        </div>
      </div>
      <div class="cards">
        <div class="card" v-for="(card, index) of playerMe.cards" :key="index">
          <Card :card="card" :style="card.style"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"/>

<style scoped lang="less">
@import url('./index.less');
</style>
