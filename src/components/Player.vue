<template>
  <div id="playerComponentContainer">
    <div v-if="playerData && playerData.trackName">
      <img v-bind:src="playerData.albumThumb" />
      <h1>{{ playerData.trackName }}</h1>
      <h2>{{ playerData.artistName }}</h2>
      <h3>{{ playerData.albumName }}</h3>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Player",
  props: ["playerData"],
  computed: {
    ...mapState({
      player: ({ spotify }) => spotify.player,
    }),
  }
};
</script>

<style lang="scss" scoped>
#playerComponentContainer {
  background: #101022;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  width: 348px;

  h1 {
    margin-top: 16px;
    font-weight: 500;
    font-size: 24px;
  }

  h2 {
    margin-top: 8px;
    font-weight: 400;
    font-size: 20px;
  }

  h3 {
    font-weight: 400;
    font-size: 16px;
  }

  img {
    width: 100%;
    border-radius: 16px;
  }
}
</style>
