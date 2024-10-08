<template>
  <div id="cardComponentContainer" :class="isPlaying ? 'isPlaying' : ''">
    <img :class="isImageRouded && 'rouded'" :src="image || artistImage" />
    <h2>{{ title }}</h2>
    <h3>{{ subTitle }}</h3>
    <div class="overlay">
      <button class="play" @click="onClickPlay">
        <ph-play size="32" weight="fill" />
      </button>
      <router-link v-if="linkRoute" :to="linkRoute">
        <ph-list size="32" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { PhPlay, PhList } from 'phosphor-vue';
import artistImage from '../assets/artist.jpg';

export default {
  name: 'Card',
  data: () => ({
    artistImage,
  }),
  props: [
    'image',
    'isPlaying',
    'subTitle',
    'title',
    'id',
    'uri',
    'isImageRouded',
    'onClickPlay',
    'linkRoute',
  ],
  components: { PhPlay, PhList },
};
</script>

<style lang="scss" scoped>
#cardComponentContainer {
  padding: 16px;
  border-radius: 16px;
  background: #0e0e20;
  display: flex;
  flex-direction: column;
  max-width: 180px;
  min-width: 180px;
  height: 280px;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #fff;

  @include md {
    max-width: 248px;
    min-width: 248px;
    height: 350px;
    padding: 24px;
  }

  &.isPlaying {
    border: rgba(29, 185, 84, 0.8) 2px solid;
  }

  .overlay {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    left: 0;
    background: linear-gradient(
      180deg,
      rgba(29, 185, 84, 0.8) 0%,
      rgba(29, 185, 84, 0.4) 50%,
      rgba(29, 185, 84, 0) 100%
    );
    position: absolute;
    opacity: 0;
    top: -100%;
    transition: ease-out 0.3s;

    button,
    a {
      border-radius: 50%;
      transition: ease-in all 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      &.play,
      & {
        background: #fff;
        color: #0e0e20;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56px;
        width: 56px;
      }
    }
  }

  &:hover {
    .overlay {
      top: 0;
      opacity: 1;
    }
  }

  h2 {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin-top: auto;

    @include md {
      font-size: 18px;
    }
  }

  h3 {
    font-size: 12px;
    font-weight: 300;
    text-align: center;
    margin-bottom: auto;
    margin-top: 8px;
    opacity: 0.7;

    @include md {
      font-size: 16px;
    }
  }

  img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 8px;

    @include md {
      width: 200px;
      height: 200px;
    }

    &.rouded {
      border-radius: 50%;
    }
  }
}
</style>
