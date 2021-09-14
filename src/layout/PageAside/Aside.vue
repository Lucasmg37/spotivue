<template>
  <aside id="asidePageContainer" :style="cssVars">
    <div class="options">
      <button type="button" @click="onClickPlay">
        <ph-play size="28" weight="fill" />
      </button>
      <div v-if="options && options.length">
        <span v-for="(option, index) in options" :key="index">
          <button v-if="option.name === 'random'" @click="option.action">
            <PhShuffle
              :weight="option.isActive ? 'fill' : 'regular'"
              size="24"
            />
          </button>
          <button v-if="option.name === 'like'" @click="option.action">
            <PhHeart :weight="option.isActive ? 'fill' : 'regular'" size="24" />
          </button>
        </span>
      </div>
    </div>
    <div class="information">
      <img :src="image" alt="" />
      <h2>{{ title }}</h2>
      <h3>{{ subTitle }}</h3>
      <p>{{ footerText }}</p>
      <button @click="onClickFollow" v-if="showFollowButton">
        <PhHeart :weight="isFollowing ? 'fill' : 'regular'" /> Seguir
      </button>
    </div>
  </aside>
</template>

<script>
import { PhPlay, PhHeart, PhShuffle } from 'phosphor-vue';

export default {
  name: 'Aside',
  props: {
    image: String,
    onClickPlay: Function,
    onClickFollow: Function,
    title: String,
    subTitle: String,
    description: String,
    footerText: String,
    showFollowButton: Boolean,
    isFollowing: Boolean,
    options: Array,
  },
  components: { PhPlay, PhHeart, PhShuffle },
  computed: {
    cssVars() {
      return {
        'background-image':
          'linear-gradient(180deg, rgba(8,8,26,.8) 0%, rgba(8,8,26,1) 100%), url(' +
          this.image +
          ')',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#asidePageContainer {
  min-width: 400px;
  max-width: 400px;
  position: relative;
  position: sticky;
  top: 0;
  display: flex;
  padding: 48px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .information {
    display: flex;
    flex-direction: column;

    img {
      width: 220px;
      height: 220px;
      border-radius: 16px;
      object-fit: cover;
      margin-bottom: 16px;
    }

    h2 {
      font-weight: 600;
      font-size: 32px;
    }

    h3 {
      font-weight: 500;
      margin-top: 8px;
    }

    button {
      color: #fff;
      border: 2px solid #fff;
      margin-right: auto;
      font-weight: 400;
      font-size: 24px;
      padding: 8px 24px;
      border-radius: 48px;
      transition: ease-in 0.2s all;

      &:hover {
        background: #fff;
        color: #0e0e20;
      }

      svg {
        margin-right: 8px;
      }
    }

    p {
      margin-top: auto;
    }
  }

  .options {
    position: absolute;
    left: calc(-56px / 2);
    top: 100px;
    display: flex;
    flex-direction: column;

    button {
      transition: ease-in 0.2s all;

      &:hover {
        transform: scale(1.1);
      }
    }

    > button {
      color: #fff;
      background: #1ed760;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    div {
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba($color: #ffffff, $alpha: 0.4);
      border-radius: 0 0 36px 36px;
      padding: 32px 0 16px 0;
      margin: auto;
      margin-top: -24px;

      button {
        color: #fff;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
      }
    }
  }
}
</style>
