<template>
  <div id="loading-component">
    <ph-spotify-logo weight="fill" size="56" />
  </div>
</template>

<script>
import { PhSpotifyLogo } from 'phosphor-vue';

export default {
  name: 'Loading',
  components: { PhSpotifyLogo },
};
</script>

<style lang="scss" scoped>
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

#loading-component {
  > svg {
    animation: spotifyAnimate 2s ease-in infinite;
  }
}
</style>