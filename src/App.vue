<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
  name: 'App',
  data: function() {
    return {
      loading: true,
    };
  },
  methods: {
    ...mapActions('user', ['userInit']),
    ...mapActions('spotify', ['playerInit']),
    ...mapMutations('spotify', ['setAccessToken']),
  },
  created() {
    const init = async () => {
      const data = await this.userInit();
      this.setAccessToken(data);

      if (['/login', '/'].includes(this.$route.path) && data) {
        this.$router.push('/app/');
      } else if (!data) {
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
