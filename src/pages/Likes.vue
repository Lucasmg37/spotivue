<template>
  <div id="playlistContainer">
    <h1>Suas Músicas Curtidas</h1>
    <div>
      <Card
        v-for="track in savedTracksUser"
        :key="track.track.id"
        :isPlaying="contextPlayerUri === track.track.uri"
        :title="track.track.name"
        :subTitle="track.track.artists[0].name"
        :image="track.track.album.images && track.track.album.images[0].url"
        :onClickPlay="() => playerPlay(false, 0, [track.track.uri])"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Card from '../components/Card.vue';

import SpotifyApi from '../services/SpotifyApi';

const Likes = {
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
      savedTracksUser: ({ spotify }) => spotify.savedTracksUser,
    }),
  },
};

export default Likes;
</script>

<style lang="scss" scoped>
#playlistContainer {
  color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 48px 16px;

  @include md {
    padding: 48px;
  }

  h1 {
    font-size: 32px;
    margin-bottom: 32px;

    @include md {
      font-size: 48px;
      margin-bottom: 80px;
    }
  }

  > div {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

    @include md {
      grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
    }
  }
}
</style>
