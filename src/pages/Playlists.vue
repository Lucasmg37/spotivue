<template>
  <div id="playlistContainer">
    <h1>Suas Playlists</h1>
    <div>
      <Card
        v-for="playlist in playlists"
        :key="playlist.id"
        :isPlaying="contextPlayerUri === playlist.uri"
        :title="playlist.name"
        :subTitle="`${playlist.tracks.total} Músicas`"
        :image="playlist.images && playlist.images[0].url"
        :onClickPlay="() => playerPlay(playlist.uri)"
        :linkRoute="`/app/playlist/${playlist.id}`"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Card from '../components/Card.vue';

import SpotifyApi from '../services/SpotifyApi';

const Playlists = {
  name: 'Playlists',
  components: { Card },
  methods: {
    playerPlay: SpotifyApi.playerPlay,
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      contextPlayerUri: ({ spotify }) => spotify.contextPlayerUri,
      playlists: ({ spotify }) => spotify.playlistsUser,
    }),
  },
};

export default Playlists;
</script>

<style lang="scss" scoped>
#playlistContainer {
  color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 48px;

  h1 {
    font-size: 48px;
    margin-bottom: 80px;
  }

  > div {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  }
}
</style>
