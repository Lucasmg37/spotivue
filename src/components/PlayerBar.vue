<template>
  <div id="playerBarContainer">
    <button
      class="button"
      @click="
        !isCurrentTrackSaved ? saveTrack(nowInfo.id) : removeTrack(nowInfo.id)
      "
    >
      <ph-heart size="28" :weight="isCurrentTrackSaved ? 'fill' : 'regular'" />
    </button>
    <div class="box-track-info box-flex">
      <img v-bind:src="nowInfo.albumThumb" />
      <div>
        <router-link
          :to="`/app/artist/${nowInfo.artistId}/album/${nowInfo.albumId}`"
          >{{ nowInfo.albumName }}</router-link
        >
        <p>{{ nowInfo.trackName }}</p>

        <div class="track-artists">
          <span v-for="artist in nowInfo.artists" :key="artist.id">
            <router-link :to="`/app/artist/${artist.id}`">{{
              artist.name
            }}</router-link>
          </span>
        </div>
      </div>
    </div>
    <div class="box-controls-bar box-flex">
      <div class="box-controls-buttons box-flex">
        <button @click="previousTrack"><ph-caret-left size="24" /></button>
        <button @click="pause" v-if="isPlaying">
          <ph-pause size="28" weight="fill" />
        </button>
        <button @click="resume" v-else>
          <ph-play size="28" weight="fill" />
        </button>
        <button @click="nextTrack"><ph-caret-right size="24" /></button>
      </div>
      <div class="box-seek-bar box-flex">
        <span>{{ nowInfo.positionStr }}</span>
        <div :style="cssVars"></div>
        <span>{{ nowInfo.durationStr }}</span>
      </div>
      <div class="box-flex">
        <button
          @click="changeRepeat"
          v-if="nowInfo.repeatMode === 0"
          class="button"
        >
          <ph-repeat size="24" />
        </button>
        <button
          @click="changeRepeat"
          v-if="nowInfo.repeatMode === 1"
          class="button active"
        >
          <ph-repeat size="24" weight="bold" />
        </button>
        <button
          @click="changeRepeat"
          v-if="nowInfo.repeatMode === 2"
          class="button active"
        >
          <ph-repeat-once size="24" weight="bold" />
        </button>
        <button
          @click="() => toogleShuffle(!this.nowInfo.shuffle)"
          v-if="nowInfo.shuffle"
          class="button active"
        >
          <ph-shuffle size="24" weight="bold" />
        </button>
        <button
          @click="() => toogleShuffle(!this.nowInfo.shuffle)"
          v-else
          class="button"
        >
          <ph-shuffle size="24" />
        </button>
      </div>
    </div>
    <button class="button volume-button hide-mobile">
      <ph-speaker-high size="24" />
      <div class="volume-controll">
        <input
          v-model="defaultVolume"
          @change="changeVolume"
          type="range"
          min="0"
          max="100"
        />
      </div>
    </button>
    <button class="button hide-mobile"><ph-queue size="24" /></button>
  </div>
</template>

<script>
import {
  PhHeart,
  PhCaretRight,
  PhCaretLeft,
  PhPlay,
  PhRepeatOnce,
  PhRepeat,
  PhShuffle,
  PhSpeakerHigh,
  PhQueue,
  PhPause,
} from 'phosphor-vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import SpotifyApi from '../services/SpotifyApi';
import localStorageConstants from '../constants/localStorage';

export default {
  name: 'PlayerBar',
  data: function () {
    return {
      interval: null,
      defaultVolume:
        localStorage.getItem(localStorageConstants.VOLUME_USER) || 50,
    };
  },
  watch: {
    nowInfo() {
      if (this.nowInfo.position && this.isPlaying) {
        clearInterval(this.interval);
        this.interval = setInterval(this.updateProgress, 1000);
      } else {
        clearInterval(this.interval);
      }
    },
  },
  methods: {
    ...mapMutations('spotify', [
      'setPlaying',
      'addSavedTracks',
      'removeSavedTracks',
    ]),
    ...mapActions('spotify', ['updateProgress']),
    saveTrack: async function (id) {
      await SpotifyApi.saveTrack(id);
      this.addSavedTracks({ track: { id } });
    },
    changeVolume: async function (e) {
      localStorage.setItem(localStorageConstants.VOLUME_USER, e.target.value);
      SpotifyApi.setVolume(e.target.value);
    },
    removeTrack: async function (id) {
      this.removeSavedTracks(id);
    },
    nextTrack() {
      this.player.nextTrack();
    },
    previousTrack() {
      this.player.previousTrack();
    },
    resume: function () {
      this.player.resume();
      this.setPlaying(true);
    },
    pause: function () {
      this.player.pause();
      this.setPlaying(false);
    },
    changeRepeat: function () {
      if (this.nowInfo.repeatMode === 0) {
        SpotifyApi.setRepeatMode('context');
      } else if (this.nowInfo.repeatMode === 1) {
        SpotifyApi.setRepeatMode('track');
      } else if (this.nowInfo.repeatMode === 2) {
        SpotifyApi.setRepeatMode('off');
      }
    },
    toogleShuffle: SpotifyApi.toogleShuffle,
  },
  components: {
    PhHeart,
    PhCaretRight,
    PhCaretLeft,
    PhPlay,
    PhRepeatOnce,
    PhShuffle,
    PhSpeakerHigh,
    PhQueue,
    PhPause,
    PhRepeat,
  },
  computed: {
    ...mapGetters('spotify', ['nowInfo', 'isCurrentTrackSaved']),
    ...mapState('spotify', ['player', 'isPlaying', 'accessToken']),
    cssVars() {
      return {
        '--perCentual': this.nowInfo.positionPerCent + '%',
      };
    },
  },
};
</script>

<style lang="scss">
#playerBarContainer {
  display: flex;
  min-height: 100px;
  margin-top: auto;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  overflow: visible;
  position: absolute;
  width: calc(100% - 32px);
  left: 16px;
  border-radius: 8px;
  bottom: 120px;
  background: rgba(255, 253, 253, 0.9);

  .volume-controll {
    width: 80px;
    position: absolute;
    display: none;
    transform: rotate(-90deg);
    top: -50px;
    margin-left: 4px;

    input {
      width: 100%;
    }
  }

  .volume-button {
    &:hover {
      .volume-controll {
        display: block;
      }
    }
  }

  @include md {
    position: relative;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 32px;
    width: 100%;
    left: auto;
    border-radius: 0px;
    bottom: auto;
    background: #fff;
  }

  .hide-mobile {
    display: none;

    @include md {
      display: flex;
    }
  }

  .active {
    background: #eee;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000113;
    border-radius: 50%;
    transition: ease 0.2s all;
    height: 48px;
    width: 48px;

    &:hover {
      background: #eee;
      transform: scale(1.1);
    }
  }

  .box-flex {
    display: flex;
    align-items: center;
  }

  .box-controls-bar {
    flex: 1;
    gap: 32px;
    display: none;

    @include md {
      display: flex;
    }
  }

  .box-seek-bar {
    flex: 1;
    gap: 16px;

    span {
      width: 50px;
      text-align: center;
    }

    div {
      display: flex;
      flex: 1;
      height: 5px;
      background: #ddd;
      border-radius: 8px;
      position: relative;

      &:before {
        content: '';
        display: flex;
        transition: linear 4s all;
        width: var(--perCentual);
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #000113;
        z-index: 1;
      }

      &:after {
        content: '';
        display: flex;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        position: absolute;
        left: calc(var(--perCentual) - 5px);
        transition: linear 4s all;
        top: -4px;
        background: #000113;
        z-index: 1;
      }
    }
  }

  .box-controls-buttons {
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

  .box-track-info {
    img {
      widows: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
      margin-right: 16px;

      @include md {
        widows: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    div {
      @include md {
        width: 300px;
      }

      .track-artists {
        display: flex;
        gap: 8px;
      }

      a {
        text-decoration: none;
        color: #000113;
      }

      a:nth-child(1) {
        font-size: 12px;
        font-weight: 400;
        display: none;

        @include md {
          display: inline;
        }
      }
      p:nth-child(2) {
        font-size: 16px;
        font-weight: 500;

        @include md {
          font-size: 20px;
        }
      }

      a:nth-child(3) {
        font-size: 14px;
        font-weight: 400;

        @include md {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
