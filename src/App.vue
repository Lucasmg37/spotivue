<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import SpotifyApi from './services/SpotifyApi';

export default {
  name: 'App',
  data: function () {
    return {
      loading: true,
    };
  },
  methods: {
    ...mapActions('user', ['userInit']),
    ...mapMutations('spotify', ['setAccessToken']),
  },
  created() {
    const init = async () => {
      const data = await this.userInit();
      if (data) {
        this.setAccessToken(data);
      }

      try {
        await SpotifyApi .getMe()
      } catch (error) {
        localStorage.clear()
        window.location.reload();
        return
      }

      if (['/login', '/'].includes(this.$route.path) && data) {
        this.$router.push('/app/');
      } else if (!data && this.$route.path !== '/auth') {
        this.$router.push('/login');
      }
    };

    init();
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-family: 'Montserrat', sans-serif;
}

button,
a,
input {
  outline: none;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

ul {
  list-style: none;
}

body,
html,
#app {
  height: 100%;
  width: 100%;
}
</style>
