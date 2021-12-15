<template>
  <div
    id="trackComponentContainer"
    :class="isPlaying ? 'active' : 'unactive'"
    @click="onPlay"
  >
    <div>
      {{ index }}
      <span>
        <span><PhPlay size="16" weight="fill" /></span>
      </span>
    </div>
    <div>{{ trackName }}</div>
    <div>{{ albumName }}</div>
    <div>{{ artistName }}</div>
    <div>{{ milesecsToMinutes(trackDuration) }}</div>
  </div>
</template>

<script>
import { PhPlay } from 'phosphor-vue';
import { milesecsToMinutes } from '../utils/time';

export default {
  name: 'Track',
  components: { PhPlay },
  methods: {
    milesecsToMinutes,
  },
  props: [
    'index',
    'onPlay',
    'isPlaying',
    'trackName',
    'albumName',
    'artistName',
    'trackDuration',
  ],
};
</script>

<style lang="scss" scoped>
#trackComponentContainer {
  display: flex;
  cursor: pointer;
  transition: ease 0.2s all;
  padding: 8px 0px 8px 24px;
  border-radius: 8px;
  position: relative;
  width: 100%;
  overflow: hidden;
  gap: 8px;
  color: rgba($color: #ffffff, $alpha: 0.6);
  flex-direction: column;

  @include md {
    padding: 32px;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  &.active {
    background: #010c17;

    > div:nth-child(2) {
      color: #1ed760;
    }

    &::before {
      content: '';
      position: absolute;
      display: block;
      background: #1ed760;
      height: 100%;
      width: 8px;
      left: 0;
      top: 0;

      @include md {
        width: 16px;
      }
    }
  }

  > div:nth-child(1) {
    padding-left: 16px;
    min-width: 48px;
    max-width: 48px;
    position: relative;
    transition: ease 0.2s all;
    display: none;

    @include md {
      display: block;
    }

    span {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: ease 1s all;

      span {
        color: #000113;
        height: 24px;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 50%;
        margin-left: 16px;
        margin-top: -2px;
      }
    }
  }

  > div:nth-child(2) {
    color: rgba($color: #ffffff, $alpha: 1);
    font-weight: 500;
    font-size: 18px;

    @include md {
      font-size: 18px;
    }
  }

  > div:nth-child(4) {
    display: none;

    @include md {
      display: block;
    }
  }

  > div:nth-child(5) {
    min-width: 56px;
    max-width: 56px;
    display: none;

    @include md {
      display: block;
    }
  }

  & + & {
    padding: 16px 0px 16px 24px;

    @include md {
      padding: calc(32px + 2px) 32px 32px;
    }

    ::before {
      content: '';
      display: block;
      position: absolute;
      width: calc(100% - 32px);
      height: 2px;
      border-radius: 8px;
      background: #0d0e1f;
      top: 0;
      left: 16px;
    }
  }

  &:hover {
    background: #0d0e1f;
    > div:nth-child(1) {
      color: rgba($color: #000000, $alpha: 0);
      span {
        opacity: 1;
      }
    }
  }

  > div {
    flex: 1;
  }
}
</style>
