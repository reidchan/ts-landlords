<template>
  <div class="room">
    <div class="top">
    </div>
    <div class="middle">
      <div class="p1">
        <div class="figure">
          <img v-if="player1.isLandlord" class="avatar" src="@/assets/img/figure/landlord.png"/>
          <img v-else class="avatar" src="@/assets/img/figure/farmer.png"/>
          <div class="message">
            <p>{{ player1.name }}</p>
          </div>
        </div>
        <div class="card" v-if="isShow">
          <img class="poker" src="@/assets/img/poker/back.png"/>
          <p class="count">{{ player1.cards.length }}</p>
        </div>
      </div>

      <!-- 展示区 -->
      <div class="show">
        <div class="operation">
          <div class="ready" v-if="isRoomReady">
            <button class="operation-button blue" @click="onClickReady">准备</button>
          </div>
          <div class="play-card" v-if="canKnockCard">
            <button class="operation-button orange" @click="onKnockOut">出牌</button>
            <button class="operation-button blue">要不起</button>
          </div>
          <div class="call-landlord" v-if="canCallLandlord">
            <button class="operation-button orange" @click="onCallLandlord">叫地主</button>
            <button class="operation-button blue" @click="onNotCallLandlord">不叫</button>
          </div>
          <div class="loot-landlord" v-if="canLootLandlord">
            <button class="operation-button orange" @click="onLootLandlord">抢地主</button>
            <button class="operation-button blue" @click="onNotLootLandlord">不抢</button>
          </div>
        </div>

       <!-- 自己出牌的展示区 -->
        <div class="me-cards" v-if="showMeCards">
          <div class="card-box">
            <div class="card" v-for="(card, index) of player1.cards" :key="index">
              <Card :card="card" :style="card.style"/>
            </div>
          </div>
        </div>
        <!-- # 自己出牌的展示区 -->

        <!-- 自己出牌状态 -->
        <div class="me-state" v-if="playerMe.stateText">
          <span>{{ playerMe.stateText }}</span>
        </div>
        <!-- # 自己出牌状态 -->

        <!-- p1出牌的展示区 -->
        <div class="p1-cards" v-if="showP1Cards">
          <div class="card-box">
            <div class="card" v-for="(card, index) of player1.cards" :key="index">
              <Card :card="card" :style="card.style"/>
            </div>
          </div>
        </div>
        <!-- # p1出牌的展示区 -->

        <!-- p1出牌状态 -->
        <div class="p1-state" v-if="player1.stateText">
          <span>{{ player1.stateText }}</span>
        </div>
        <!-- # p1出牌状态 -->

        <!-- p2出牌的展示区 -->
        <div class="p2-cards" v-if="showP2Cards">
          <div class="card-box">
            <div class="card" v-for="(card, index) of player2.cards" :key="index">
              <Card :card="card"/>
            </div>
          </div>
        </div>
        <!-- # p2出牌的展示区 -->

        <!-- p2出牌状态 -->
        <div class="p2-state" v-if="player2.stateText">
          <span>{{ player2.stateText }}</span>
        </div>
        <!-- # p2出牌状态 -->
      </div>
      <!-- # 展示区 -->

      <div class="p2">
        <div class="card" v-if="isShow">
          <img class="poker" src="@/assets/img/poker/back.png"/>
          <p class="count">{{ player2.cards.length }}</p>
        </div>
        <div class="figure">
          <img v-if="player2.isLandlord" class="avatar" src="@/assets/img/figure/landlord.png"/>
          <img v-else class="avatar" src="@/assets/img/figure/farmer.png"/>
          <div class="message">
            <p>{{ player2.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="figure">
        <img v-if="playerMe.isLandlord" class="avatar" src="@/assets/img/figure/landlord.png"/>
        <img v-else class="avatar" src="@/assets/img/figure/farmer.png"/>
        <div class="message">
          <p>{{ playerMe.name }}</p>
        </div>
      </div>
      <div>
    </div>

      <div class="my-card">
        <div class="not-start" v-if="isRoomWait">
          <p>玩家人数还不够呢，请等待玩家进入...</p>
        </div>
        <div class="cards" v-if="isShow">
          <div class="card-box">
            <div :class="{ card: true, active: card.active }" v-for="(card, index) of playerMe.cards" :key="index" @click="onCardClick(index)">
              <Card :card="card"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"/>

<style scoped lang="less">
@import url('./index.less');
</style>
