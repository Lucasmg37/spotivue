<template>
  <Page>
    <main id="playlistContent">
      <Track
        v-for="(track, index) in tracks"
        :key="track.track.id"
        :index="index + 1"
        :onPlay="() => playTrack(index)"
        :isPlaying="track.track.id === nowInfo.id"
        :trackName="track.track.name"
        :albumName="track.track.album.name"
        :artistName="track.track.artists[0].name"
        :trackDuration="track.track.duration_ms"
      ></Track>
    </main>
    <Aside
      :image="playlist.images && playlist.images[0].url"
      :onClickPlay="() => playTrack(0)"
      :title="playlist.name"
      :subTitle="playlist.owner && playlist.owner.display_name"
      :footerText="`${playlist.tracks && playlist.tracks.total} músicas`"
      :options="[
        {
          name: 'random',
          action: playPlaylistRandom,
        },
        {
          name: 'like',
          action: savePlaylist,
          isActive: isFollowing,
        },
      ]"
    />
  </Page>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import SpotifyApi from '../services/SpotifyApi';
import Track from '../components/Track.vue';
import Page from '../layout/PageAside/Page.vue';
import Aside from '../layout/PageAside/Aside.vue';
import { PhPlay, PhHeart } from 'phosphor-vue';
import { getAllForPaginator } from '../utils/spotifyRequests';

const Playlist = {
  name: 'Playlist',
  components: { Track, PhPlay, PhHeart, Page, Aside },
  created() {
    this.init();
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      playlistsUser: ({ spotify }) => spotify.playlistsUser,
    }),
    ...mapGetters('spotify', ['nowInfo']),
    cssVars() {
      return {
        'background-image':
          'linear-gradient(180deg, rgba(8,8,26,.8) 0%, rgba(8,8,26,1) 100%), url(' +
          this.playlist.images[0].url +
          ')',
      };
    },
  },
  data: function() {
    return {
      tracks: [],
      playlist: {},
      isFollowing: false,
    };
  },
  watch: {
    accessToken: function() {
      this.init();
    },
    $route: function() {
      this.init();
    },
    playlistsUser: function() {
      this.verifiedIfFollowing();
    },
  },
  methods: {
    ...mapMutations('spotify', ['addSavedPlaylist', 'removeSavedPlaylist']),
    verifiedIfFollowing: function() {
      this.isFollowing = !!this.playlistsUser.filter(
        item => item.id === this.$route.params.id,
      ).length;
    },
    savePlaylist: async function() {
      if (this.isFollowing) {
        SpotifyApi.unFollowPlaylist(this.$route.params.id);
        this.removeSavedPlaylist(this.$route.params.id);
      } else {
        SpotifyApi.followPlaylist(this.$route.params.id);
        this.addSavedPlaylist(this.playlist);
      }
    },
    playPlaylistRandom: async function() {
      const position = Math.trunc(Math.random() * (this.tracks.length + 1));
      await SpotifyApi.playerPlay(this.playlist.uri, position);
      SpotifyApi.toogleShuffle(true);
    },
    init: async function() {
      if (this.accessToken) {
        this.verifiedIfFollowing();

        this.playlist = await SpotifyApi.getPlaylist(this.$route.params.id);
        this.tracks = await getAllForPaginator(
          SpotifyApi.playlistTracks,
          {},
          { playlistId: this.$route.params.id },
        );
      }
    },
    playTrack: function(position) {
      SpotifyApi.playerPlay(this.playlist.uri, position);
    },
  },
};

export default Playlist;
</script>

<style lang="scss" scoped>
#playlistContent {
  padding: 48px;
}
</style>
