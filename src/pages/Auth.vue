<template>
  <div id="authContainer">
    <ph-spotify-logo weight="fill" size="56" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { getParamsFromSpotifyCallback } from '../utils/spotifyCallback';
import { PhSpotifyLogo } from 'phosphor-vue';

export default {
  name: 'Auth',
  components: { PhSpotifyLogo },
  methods: {
    ...mapMutations('spotify', ['setAccessToken']),
    ...mapMutations('user', ['setAccessTokenUser']),
  },
  created() {
    const params = getParamsFromSpotifyCallback(window.location);

    if (!params.access_token) {
      this.$router.push('/login');
      return;
    }

    this.setAccessTokenUser(params.access_token);
    this.setAccessToken(params.access_token);

    setTimeout(() => {
      this.$router.push('/app/');
    }, 2000);
  },
};
</script>


<style lang="scss" scoped>
@keyframes bgAnimate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spotifyAnimate {
  0% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.3);
  }
}

#authContainer {
  background: linear-gradient(
    50deg,
    rgba(14, 14, 32, 1) 0%,
    rgba(29, 185, 84, 1) 100%
  );
  background-size: 400% 400%;
  height: 100%;
  width: 100%;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  gap: 24px;
  animation: bgAnimate 5s ease-in infinite;

  > svg {
    animation: spotifyAnimate 2s ease-in infinite;
  }
}
</style>
