<template>
  <div id="bannerComponentContainer">
    <img :src="image" />

    <div class="info">
      <div>
        <div :class="isPlaying ? 'isPlaying' : ''">
          <button :class="isPlaying ? 'isPlaying' : ''" @click="onClickPlay">
            <ph-play size="28" weight="fill" />
          </button>
          <router-link v-if="linkRoute" :to="linkRoute">
            <ph-link size="28" />
          </router-link>
        </div>
        <div>
          <h2>{{ title }}</h2>
          <h3>{{ subTitle }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PhPlay, PhLink } from 'phosphor-vue';

export default {
  name: 'Banner',
  props: [
    'image',
    'isPlaying',
    'subTitle',
    'title',
    'id',
    'uri',
    'onClickPlay',
    'linkRoute',
  ],
  components: { PhPlay, PhLink },
};
</script>

<style lang="scss" scoped>
#bannerComponentContainer {
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  min-width: 500px;
  height: 300px;
  align-items: center;
  position: relative;
  overflow: hidden;
  opacity: 0.9;
  transition: ease-in 0.2s all;

  .info {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 32px;
    background: linear-gradient(
      50deg,
      rgba(14, 14, 32, 0.8) 0%,
      rgba(14, 14, 32, 0.6) 50%,
      rgba(14, 14, 32, 0.4) 100%
    );
    background-size: 400% 400%;
    background-position: 0% 50%;
    display: flex;
    transition: ease-in all 0.2s;

    &:hover {
      background-position: 100% 50%;

      > div {
        > div:first-child {
          opacity: 1;
          min-width: 112px;
        }
      }
    }

    > div {
      display: flex;
      align-items: center;
      margin-top: auto;

      > div:first-child {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-right: 16px;
        opacity: 0;
        max-width: 0px;
        min-width: 0px;
        overflow: hidden;
        transition: ease-in-out 0.5s all;

        &.isPlaying {
          opacity: 1;
          min-width: 112px;
        }
      }

      button,
      a {
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        min-height: 48px;
        min-width: 48px;
        border: 2px solid #fff;
        transition: ease-in all 0.2s;
        cursor: pointer;

        &:hover {
          color: #0e0e20;
          background: #fff;
        }

        &.isPlaying {
          color: #fff;
          background: rgba(29, 185, 84, 1);
          border: 2px solid rgba(29, 185, 84, 1);
        }
      }
    }

    h2 {
      font-size: 18px;
      font-weight: 500;
      margin-top: auto;
    }

    h3 {
      font-size: 16px;
      font-weight: 300;
      margin-bottom: auto;
      margin-top: 8px;
      opacity: 0.7;
    }
  }

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 8px;
  }
}
</style>
