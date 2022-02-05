<template>
  <div id="wrapperContainer">
    <Menu></Menu>
    <main>
      <Modal v-if="showModal" :onClose="onCloseModal" />
      <router-view></router-view>
      <PlayerBar v-if="playerActive"></PlayerBar>
    </main>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Menu from '../components/Menu.vue';
import PlayerBar from '../components/PlayerBar.vue';
import Modal from '../components/Modal.vue';

export default {
  name: 'Wrapper',
  components: { Menu, PlayerBar, Modal },
  computed: {
    ...mapState({
      authError: ({ spotify }) => spotify.authError,
      accessToken: ({ spotify }) => spotify.accessToken,
      playerActive: ({ spotify }) => spotify.playerActive,
      user: ({ spotify }) => spotify.user,
    }),
  },
  created() {
    this.initWrapper();
  },
  data() {
    return {
      isNotPremiumOk: localStorage.getItem('premiumInfoOk') === '1',
      showModal: false,
    };
  },
  methods: {
    onCloseModal() {
      this.showModal = false;
      localStorage.setItem('premiumInfoOk', '1');
    },
    ...mapActions('spotify', [
      'playerInit',
      'getMePlayerAction',
      'getMeAction',
      'getAllLikedTracks',
      'getAllFollowingArtists',
      'getAllSavedAlbums',
      'getAllPlaylists',
    ]),
    ...mapMutations('user', ['signOut']),
    ...mapMutations('spotify', ['setSavedTracks']),
    initWrapper: async function () {
      if (this.accessToken) {
        new Promise(() => {
          if (window.Spotify) {
            this.playerInit();
          } else {
            window.onSpotifyWebPlaybackSDKReady = this.playerInit;
          }
        });

        this.getMeAction();
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
    user(user) {
      if (user.id) {
        if (user.product !== 'premium' && !this.isNotPremiumOk) {
          this.showModal = true;
        }
      }
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

  flex-direction: column-reverse;

  @include md {
    flex-direction: row;
  }

  > main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    position: relative;
  }
}
</style>
