<template>
  <div id="playerContainer" :style="cssVars">
    <player-component v-bind:playerData="nowInfo" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import PlayerComponent from '../components/Player.vue';

const Player = {
  name: 'Player',
  components: { PlayerComponent },
  computed: {
    ...mapState({
      device: ({ spotify }) => spotify.device,
      accessToken: ({ spotify }) => spotify.accessToken,
    }),
    ...mapGetters('spotify', ['nowInfo']),
    cssVars() {
      return {
        'background-image': 'linear-gradient(180deg, rgba(8,8,26,.8) 0%, rgba(8,8,26,1) 100%), url(' + this.nowInfo.albumThumb + ')',
      };
    },
  },
};

export default Player;
</script>

<style lang="scss" scoped>
#playerContainer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
