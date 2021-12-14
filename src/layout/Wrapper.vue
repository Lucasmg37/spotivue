<template>
  <div id="wrapperContainer">
    <Menu></Menu>
    <main>
      <router-view></router-view>
      <PlayerBar v-if="playerActive"></PlayerBar>
    </main>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Menu from '../components/Menu.vue';
import PlayerBar from '../components/PlayerBar.vue';

export default {
  name: 'Wrapper',
  components: { Menu, PlayerBar },
  computed: {
    ...mapState({
      authError: ({ spotify }) => spotify.authError,
      accessToken: ({ spotify }) => spotify.accessToken,
      playerActive: ({ spotify }) => spotify.playerActive,
    }),
  },
  created() {
    this.initWrapper();
  },
  methods: {
    ...mapActions('spotify', [
      'playerInit',
      'getMePlayerAction',
      'getAllLikedTracks',
      'getAllFollowingArtists',
      'getAllSavedAlbums',
      'getAllPlaylists',
    ]),
    ...mapMutations('user', ['signOut']),
    ...mapMutations('spotify', ['setSavedTracks']),
    initWrapper: async function () {
      if (this.accessToken) {
        console.log('initWrapper');

        new Promise(() => {
          if (window.Spotify) {
            this.playerInit();
          } else {
            window.onSpotifyWebPlaybackSDKReady = this.playerInit;
          }
        });

        console.log('initWrapper2');

        this.getMePlayerAction();
        this.getAllLikedTracks();
        this.getAllFollowingArtists();
        this.getAllSavedAlbums();
        this.getAllPlaylists();
      }
    },
  },
  watch: {
    accessToken() {
      this.initWrapper();
    },
    authError(status) {
      if (status) {
        this.signOut();
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#wrapperContainer {
  height: 100%;
  width: 100%;
  display: flex;
  background: #08081a;
  overflow: hidden;

  > main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
}
</style>
