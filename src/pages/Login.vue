<template>
  <div id="loginContainer">
    <div>
      <h1>Um novo conceito para o <span>Spotify.</span></h1>

      <p>Uma interface diferente para você que ama ouvir músicas no Spotify.</p>

      <small>Somente para contas Premium. <button>Saiba mais</button> </small>

      <button @click="auth" type="button">
        <ph-spotify-logo weight="fill" size="32" /> Continue com o Spotify
      </button>
    </div>
    <div>
      <div>
        <img src="../assets/macbook.png" alt="MacBook com imagem do sistema" />
        <div class="screen"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { PhSpotifyLogo } from 'phosphor-vue';
import { mapMutations } from 'vuex';
import { toQuery } from '../utils/urlUtils';

const Login = {
  name: 'Login',
  components: { PhSpotifyLogo },
  methods: {
    ...mapMutations('spotify', ['setAccessToken']),
    ...mapMutations('user', ['setAccessTokenUser']),
    auth: function () {
      const search = toQuery({
        client_id: process.env.VUE_APP_SPOTIFY_CLIENT_ID,
        scope: process.env.VUE_APP_SPOTIFY_SCOPES,
        redirect_uri: process.env.VUE_APP_SPOTIFY_REDIRECT_URL,
        response_type: 'token',
      });

      window.location.href = `https://accounts.spotify.com/authorize?${search}`;
    },
  },
};

export default Login;
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

#loginContainer {
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

  div:first-child {
    flex: 1;
    display: flex;
    max-width: 500px;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: 54px;
      margin-bottom: 24px;

      span {
        color: #1db954;
      }
    }

    p {
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 24px;
      opacity: 0.8;
    }

    small {
      font-weight: 400;
      font-size: 16px;
      opacity: 0.7;

      button {
        color: #fff;
        display: inline;
        font-weight: 400;
        font-size: 16px;
        text-decoration: underline;
      }
    }

    > button {
      background: #1db954;
      color: #fff;
      font-size: 24px;
      border-radius: 8px;
      padding: 32px 48px;
      font-weight: 700;
      margin-top: 56px;

      svg {
        margin-right: 8px;
      }
    }
  }

  div:last-child {
    flex: 1;
    max-width: 900px;
    position: relative;
    display: none;

    @include md {
      display: flex;
    }

    img {
      width: 100%;
      height: auto;
      z-index: 2;
      position: relative;
    }

    .screen {
      background-color: #0e0e20;
      background-image: url('../assets/example.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      top: 6.1%;
      left: 13.8%;
      width: 71.6%;
      height: 75.4%;
      z-index: 1;
    }
  }
}
</style>
