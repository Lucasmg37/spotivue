<template>
  <div id="playerDevice">
    <div :class="close ? 'contentHidden close' : 'contentHidden'">
      <div class="device">
        <div>
          <ph-desktop :size="32" />
        </div>
        <div>
          <div>Ouvindo em:</div>
          <div>{{ activeDevice.name }}</div>
        </div>
        <div class="box-controls-buttons">
          <button @click="previousTrack"><ph-caret-left size="24" /></button>
          <button @click="pause" v-if="isPlaying">
            <ph-pause size="28" weight="fill" />
          </button>
          <button @click="resume" v-else>
            <ph-play size="28" weight="fill" />
          </button>
          <button @click="nextTrack"><ph-caret-right size="24" /></button>
        </div>
      </div>
      <div class="infotrack">
        <img v-bind:src="nowInfo.albumThumb" />
        <div>
          <router-link
            :to="`/app/artist/${nowInfo.artistId}/album/${nowInfo.albumId}`"
            >{{ nowInfo.albumName }}</router-link
          >
          <p>{{ nowInfo.trackName }}</p>
          <router-link :to="`/app/artist/${nowInfo.artistId}`">{{
            nowInfo.artistName
          }}</router-link>
        </div>
      </div>
      <div :style="cssVars" class="seek-bar"></div>
    </div>
    <div :class="close ? 'floatButtons close' : 'floatButtons'">
      <button @click="closeAction">
        <ph-x :size="24" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import {
  PhDesktop,
  PhCaretRight,
  PhCaretLeft,
  PhPlay,
  PhPause,
  // // PhRepeatOnce,
  // // PhRepeat,
  // // PhShuffle,
  // // PhSpeakerHigh,
  PhX,
  // // PhHeart,
} from 'phosphor-vue';
import SpotifyApi from '../services/SpotifyApi';

export default {
  name: 'PlayerDevice',
  props: ['closeInfo'],
  components: {
    PhDesktop,
    PhCaretRight,
    PhCaretLeft,
    PhPlay,
    PhPause,
    PhX,
  },
  created() {
    this.updateTimeSeekBar();
    this.getMePlayerAction();
  },
  computed: {
    ...mapGetters('spotify', ['nowInfo', 'isCurrentTrackSaved']),
    ...mapState('spotify', [
      'player',
      'isPlaying',
      'accessToken',
      'activeDevice',
    ]),
    cssVars() {
      return {
        '--perCentual': this.nowInfo.positionPerCent + '%',
      };
    },
  },
  methods: {
    ...mapActions('spotify', ['updateProgress', 'getMePlayerAction']),
    ...mapMutations('spotify', ['setPlaying']),
    updateTimeSeekBar() {
      if (this.nowInfo.position) {
        if (this.nowInfo.positionPerCent >= 100) {
          clearInterval(this.interval);
          setTimeout(() => {
            // this.getMePlayerAction();
          }, 2000);
          return;
        }

        clearInterval(this.interval);
        this.interval = setInterval(this.updateProgress, 1000);
      } else {
        clearInterval(this.interval);
      }
    },
    async nextTrack() {
      await SpotifyApi.playerNext();

      setTimeout(() => {
        this.getMePlayerAction();
      }, 1000);

      this.setPlaying(true);
    },
    async previousTrack() {
      await SpotifyApi.playerPrevious();
      setTimeout(() => {
        this.getMePlayerAction();
      }, 1000);
      this.setPlaying(true);
    },
    async resume() {
      await SpotifyApi.playerPlay();
      this.getMePlayerAction();
      this.setPlaying(true);
    },
    async pause() {
      await SpotifyApi.playerPause();
      this.getMePlayerAction();
      this.setPlaying(false);
    },
    closeAction() {
      this.close = true;

      setTimeout(() => {
        this.closeInfo();
      }, 1000);
    },
  },
  watch: {
    nowInfo() {
      this.updateTimeSeekBar();
    },
  },
  data() {
    return {
      close: false,
      interval: null,
    };
  },
};
</script>

<style lang="scss" scoped>
@keyframes open {
  0% {
    width: 0px;
    height: 0;
    opacity: 0;
  }
  100% {
    width: 400px;
    height: 200px;
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  100% {
    opacity: 0;
    transform: translateY(50px);
  }
  0% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes close {
  100% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  0% {
    width: 400px;
    height: 200px;
    opacity: 1;
  }
}

#playerDevice {
  position: absolute;
  z-index: 999;
  bottom: 0;

  .contentHidden {
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    animation: open cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s forwards;
    overflow-y: auto;
    overflow-x: auto;
    display: flex;
    padding: 16px;
    color: #000113;
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 200px;

    &.close {
      animation: close cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s forwards;
      animation-delay: 0.2s;
    }

    .device {
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: left;
      margin-bottom: 16px;

      > div:first-child {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #1ed760;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      > div:nth-child(2) {
        > div:first-child {
          font-size: 16px;
          font-weight: 500;
        }
        > div:last-child {
          font-size: 22px;
          font-weight: 600;
        }
      }

      .box-controls-buttons {
        display: flex;
        align-items: center;
        margin-left: auto;

        button {
          align-items: center;
          justify-content: center;
          transition: ease 0.2s all;

          &:hover {
            transform: scale(1.1);
          }
        }

        button:nth-child(1),
        button:nth-child(3) {
          width: 50px;
          padding: 4px;
          background: #ddd;
        }

        button:nth-child(1) {
          border-radius: 32px 0 0 32px;
          padding-right: 8px;
          margin-right: -16px;
        }
        button:nth-child(2) {
          color: #fff;
          background: #1ed760;
          height: 48px;
          width: 48px;
          border-radius: 50%;
          position: relative;
          z-index: 1;
        }
        button:nth-child(3) {
          border-radius: 0 32px 32px 0;
          padding-left: 8px;
          margin-left: -16px;
          position: relative;
          z-index: 0;
        }
      }
    }

    .infotrack {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;

      > img {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        object-fit: cover;
      }

      > div {
        display: flex;
        flex-direction: column;
        text-align: left;
        overflow: hidden;

        a {
          text-decoration: none;
          color: #000113;
        }

        a:nth-child(1) {
          font-size: 12px;
          font-weight: 400;
          display: inline;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        p:nth-child(2) {
          font-size: 20px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        a:nth-child(3) {
          font-size: 16px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      }
    }
  }

  .seek-bar {
    display: flex;
    flex: 1;
    height: 20px;
    background: #ddd;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    &:before {
      content: '';
      display: flex;
      transition: linear 2s all;
      width: var(--perCentual);
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: #1ed760;
      z-index: 1;
    }
  }
  .floatButtons {
    position: absolute;
    top: 0;
    right: -48px;
    opacity: 0;
    animation: fadeIn cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s forwards;
    animation-delay: 0.5s;

    &.close {
      animation: fadeOut cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s forwards;
    }

    > button {
      background: #fff;
      height: 40px;
      width: 40px;
      color: #000113;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: ease 0.2s all;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>