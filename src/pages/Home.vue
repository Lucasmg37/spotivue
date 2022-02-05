<template>
  <div id="homeContainer">
    <div v-if="!tracks.length || !homeSections.length" class="loadingContainer">
      <Loading />
    </div>

    <div class="content" v-else>
      <h1>Para você</h1>
      <div>
        <Carousel
          v-if="relatedArtistsCurrent.length"
          :title="`Combina com ${nowInfo.artistName}`"
        >
          <Banner
            v-for="artist in relatedArtistsCurrent"
            :key="artist.id"
            :title="artist.name"
            :subTitle="`${getFormattedFollowers(
              artist.followers.total,
            )} seguidores`"
            :image="artist.images[0] ? artist.images[0].url : artistImage"
            :isPlaying="contextPlayerUri === artist.uri"
            :onClickPlay="() => playArtists(artist.uri)"
            :linkRoute="`/app/artist/${artist.id}`"
          />
        </Carousel>
      </div>
      <div>
        <Carousel
          v-if="topTrackCurrentArtists.length"
          :title="`As mais ouvidas de ${nowInfo.artistName}`"
        >
          <Card
            v-for="track in topTrackCurrentArtists"
            :key="track.id"
            :title="track.name"
            :subTitle="track.artists[0].name"
            :image="track.album.images[0].url"
            :isPlaying="track.id === nowInfo.id"
            :onClickPlay="() => playerPlay(false, 0, [track.uri])"
          />
        </Carousel>
        <Carousel title="Você não para de ouvir">
          <Card
            v-for="track in tracks"
            :key="track.id"
            :title="track.name"
            :subTitle="track.artists[0].name"
            :image="track.album.images[0].url"
            :isPlaying="track.id === nowInfo.id"
            :onClickPlay="() => playerPlay(false, 0, [track.uri])"
          />
        </Carousel>
        <Carousel title="Seus preferidos">
          <Card
            v-for="artist in artists"
            :key="artist.id"
            :title="artist.name"
            subTitle=""
            :image="artist.images[0].url"
            :isPlaying="contextPlayerUri === artist.uri"
            :isImageRouded="true"
            :onClickPlay="() => playArtists(artist.uri)"
            :linkRoute="`/app/artist/${artist.id}`"
          />
        </Carousel>

        <Carousel v-if="playlists.length" title="Algumas de suas Playlists">
          <Banner
            v-for="playlist in playlists"
            :key="playlist.id"
            :title="playlist.name"
            :subTitle="`${playlist.tracks.total} Músicas`"
            :image="playlist.images[0].url"
            :isPlaying="contextPlayerUri === playlist.uri"
            :onClickPlay="() => playArtists(playlist.uri)"
            :linkRoute="`/app/playlist/${playlist.id}`"
          />
        </Carousel>

        <Carousel
          v-for="homeSection in homeSections"
          :key="homeSection.artist.id"
          :title="`Porque você ouve ${homeSection.artist.name}`"
        >
          <Card
            v-for="artist in homeSection.artists"
            :key="artist.id"
            :title="artist.name"
            subTitle=""
            :image="artist.images[0].url"
            :isPlaying="contextPlayerUri === artist.uri"
            :isImageRouded="true"
            :onClickPlay="() => playArtists(artist.uri)"
            :linkRoute="`/app/artist/${artist.id}`"
          />
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Card from '../components/Card.vue';
import Banner from '../components/Banner.vue';
import Carousel from '../components/Carousel.vue';
import Loading from '../components/Loading.vue';
import SpotifyApi from '../services/SpotifyApi';
import { getFormattedFollowers } from '../utils/follow';
import artistImage from '../assets/artist.jpg';

const Home = {
  name: 'Home',
  components: { Card, Carousel, Banner, Loading },
  data: function () {
    return {
      relatedArtistsCurrent: [],
      topTrackCurrentArtists: [],
      homeSections: [],
      artistImage,
    };
  },
  methods: {
    ...mapActions('spotify', [
      'getTopTracks',
      'getTopArtists',
      'getAllPlaylists',
      'getMePlayerAction',
    ]),
    getFormattedFollowers,
    playArtists: async function (data) {
      await SpotifyApi.playArtists(data);
      this.getMePlayerAction();
    },
    playerPlay: async function (data, position, uri) {
      await SpotifyApi.playerPlay(data, position, uri);
      this.getMePlayerAction();
    },
    init: async function () {
      if (this.accessToken) {
        this.getTopTracks();
        this.getTopArtists();
        this.getAllPlaylists();
      }
    },
    generateHomeData: async function () {
      if (this.artists.length) {
        const homeSectionsData = [];
        for (let index = 0; index <= 2; index++) {
          const { artists } = await SpotifyApi.getRelatedArtist(
            this.artists[index].id,
          );
          homeSectionsData.push({ artist: this.artists[index], artists });
        }
        this.homeSections = homeSectionsData;
      }
    },
    getCurrentData: async function () {
      if (this.idArtistCurrent && this.accessToken) {
        const { artists } = await SpotifyApi.getRelatedArtist(
          this.idArtistCurrent,
        );
        this.relatedArtistsCurrent = artists;
        const { tracks } = await SpotifyApi.getArtistTopTracks(
          this.idArtistCurrent,
          {
            market: 'BR',
          },
        );
        this.topTrackCurrentArtists = tracks;
      }
    },
  },
  watch: {
    accessToken: function () {
      this.init();
    },
    idArtistCurrent: function () {
      this.getCurrentData();
    },
    artists: function () {
      this.generateHomeData();
    },
  },
  created() {
    this.init();
    this.getCurrentData();
  },
  computed: {
    ...mapState({
      device: ({ spotify }) => spotify.device,
      accessToken: ({ spotify }) => spotify.accessToken,
      tracks: ({ spotify }) => spotify.topTracks,
      artists: ({ spotify }) => spotify.topArtists,
      contextPlayerUri: ({ spotify }) => spotify.contextPlayerUri,
      idArtistCurrent: ({ spotify }) => spotify.idArtistCurrent,
      playlists: ({ spotify }) => spotify.playlistsUser,
    }),
    ...mapGetters('spotify', ['nowInfo']),
  },
};

export default Home;
</script>

<style lang="scss" scoped>
#homeContainer {
  flex: 1;
  display: flex;
  color: #fff;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  padding: 48px 0;

  .loadingContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .content {
    > h1 {
      font-size: 32px;
      padding: 0 16px;

      @include md {
        padding-left: 48px;
        font-size: 48px;
      }
    }

    > div {
      margin-bottom: 56px;
    }
  }
}
</style>
