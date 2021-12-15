<template>
  <aside id="menuContainerComponent">
    <div>
      <ph-spotify-logo weight="fill" size="40" />
    </div>
    <div>
      <router-link to="/app/"> <ph-house size="32" /></router-link>
      <router-link to="/app/playlist"><ph-playlist size="32" /></router-link>
      <router-link to="/app/search"
        ><ph-magnifying-glass size="32"
      /></router-link>
      <button v-if="device" @click="listenHere">
        <ph-speaker-high size="32" />
      </button>
      <router-link to="/app/about"><ph-github-logo size="32" /></router-link>
    </div>
    <div>
      <ph-spotify-logo weight="fill" size="32" />
    </div>
  </aside>
</template>

<script>
import SpotifyService from '../services/SpotifyApi';
import {
  PhHouse,
  PhSpotifyLogo,
  PhMagnifyingGlass,
  PhSpeakerHigh,
  PhPlaylist,
  PhGithubLogo,
} from 'phosphor-vue';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Menu',
  components: {
    PhHouse,
    PhSpotifyLogo,
    PhMagnifyingGlass,
    PhSpeakerHigh,
    PhPlaylist,
    PhGithubLogo,
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      device: ({ spotify }) => spotify.device,
    }),
  },
  methods: {
    ...mapMutations('spotify', ['setPlaying']),
    async listenHere() {
      await SpotifyService.transferUserPlayback(this.device);
      this.setPlaying(true);
    },
  },
};
</script>

<style lang="scss">
#menuContainerComponent {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #2d2d3f;
  padding: 24px 0px;
  border-radius: 8px 8px 0 0;
  display: flex;

  @include md {
    border-radius: 0;
    padding: 24px 16px;
  }

  div:nth-child(1) {
    color: #fff;
    display: none;

    @include md {
      display: block;
    }
  }

  div:nth-child(3) {
    color: #fff;
    display: none;

    @include md {
      display: block;
    }
  }

  div:nth-child(2) {
    display: flex;

    align-items: center;

    flex-direction: row;
    width: 100%;
    justify-content: space-around;

    @include md {
      flex-direction: column;
      justify-content: center;
      gap: 24px;
    }

    a,
    button {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      text-decoration: none;
      transition: ease all 0.2s;
      border-radius: 8px;

      &:hover {
        background: #fff;
        color: #08081a;
      }
    }
  }
}
</style>
