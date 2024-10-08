<template>
  <Page>
    <main id="artistContent">
      <div v-if="isLoading" class="loadingContainer">
        <Loading />
      </div>

      <div class="content" v-else>
        <h1>Neste álbum</h1>
        <p>
          Ver
          <router-link :to="'/app/artist/' + album.artists[0].id">
            <a>{{ album.artists && album.artists[0].name }} <ph-link /></a>
          </router-link>
        </p>

        <section v-if="tracks.length" class="sectionTracks">
          <Track
            v-for="(track, index) in tracks"
            :key="track.id"
            :index="track.track_number"
            :onPlay="() => playerPlay(album.uri, index)"
            :isPlaying="
              track.id === nowInfo.id || track.id === nowInfo.likedFromId
            "
            :trackName="track.name"
            :albumName="album.name"
            :artistName="track.artists[0].name"
            :trackDuration="track.duration_ms"
          />
        </section>

        <section v-if="albums.length" class="sectionAlbum">
          <h2>Outros álbums</h2>
          <Carousel>
            <Card
              v-for="album in albums.slice(0, 10)"
              :key="album.id"
              :title="album.name"
              :subTitle="album.artists[0].name"
              :image="album.images[0] ? album.images[0].url : artistImage"
              :isPlaying="contextPlayerUri === album.uri"
              :isImageRouded="true"
              :onClickPlay="() => playArtists(album.uri)"
              :linkRoute="`/app/artist/${$route.params.id}/album/${album.id}`"
            />
          </Carousel>
        </section>
        <section v-if="related.length" class="sectionRelated">
          <h2>Relacionados</h2>
          <Carousel>
            <Card
              v-for="artist in related.slice(0, 10)"
              :key="artist.id"
              :title="artist.name"
              subTitle=""
              :image="artist.images[0] ? artist.images[0].url : artistImage"
              :isPlaying="contextPlayerUri === artist.uri"
              :isImageRouded="true"
              :onClickPlay="() => playArtists(artist.uri)"
              :linkRoute="`/app/artist/${artist.id}`"
            />
          </Carousel>
        </section>
      </div>
    </main>
    <Aside
      :image="album.images[0] ? album.images[0].url : artistImage"
      :onClickPlay="() => playerPlay(album.uri, 0)"
      :title="album.name"
      :subTitle="album.artists[0].name"
      :showFollowButton="false"
      :footerText="`${album.total_tracks} músicas`"
      :options="[
        {
          name: 'random',
          action: playAlbumRandom,
        },
        {
          name: 'like',
          action: saveAlbum,
          isActive: isFollowing,
        },
      ]"
    />
  </Page>
</template>

<script>
import Page from '../layout/PageAside/Page';
import Aside from '../layout/PageAside/Aside';
import Track from '../components/Track';
import Carousel from '../components/Carousel';
import Card from '../components/Card';
import SpotifyApi from '../services/SpotifyApi';
import { mapGetters, mapMutations, mapState } from 'vuex';
import artistImage from '../assets/artist.jpg';
import { getAllForPaginator } from '../utils/spotifyRequests';
import Loading from '../components/Loading.vue';
import { PhLink } from 'phosphor-vue';

export default {
  name: 'Album',
  components: { Page, Aside, Track, Card, Carousel, Loading, PhLink },
  watch: {
    accessToken: function () {
      this.init();
    },
    $route: function () {
      this.init();
    },
    savedAlbums: function () {
      this.verifiedIfFollowing();
    },
  },
  created: function () {
    this.init();
  },
  data: function () {
    return {
      tracks: [],
      related: [],
      albums: [],
      artistImage,
      album: {},
      isFollowing: false,
      isLoading: true,
    };
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      contextPlayerUri: ({ spotify }) => spotify.contextPlayerUri,
      savedAlbums: ({ spotify }) => spotify.savedAlbums,
    }),
    ...mapGetters('spotify', ['nowInfo']),
  },
  methods: {
    ...mapMutations('spotify', ['addSavedAlbums', 'removeSavedAlbums']),
    playerPlay: SpotifyApi.playerPlay,
    playArtists: SpotifyApi.playArtists,
    verifiedIfFollowing: function () {
      this.isFollowing = !!this.savedAlbums.filter(
        item => item.album.id === this.$route.params.id_album,
      ).length;
    },
    saveAlbum: async function () {
      if (this.isFollowing) {
        SpotifyApi.removeAlbum([this.$route.params.id_album]);
        this.removeSavedAlbums(this.$route.params.id_album);
      } else {
        SpotifyApi.saveAlbum([this.$route.params.id_album]);
        this.addSavedAlbums({ album: this.album });
      }
    },
    playAlbumRandom: async function () {
      const position = Math.trunc(Math.random() * (this.tracks.length + 1));
      await this.playerPlay(this.album.uri, position);
      SpotifyApi.toogleShuffle(true);
    },
    init: async function () {
      const pageScroll = document.getElementById('pageAsideContainer');
      pageScroll && pageScroll.scrollTo(0, 0);

      if (this.accessToken) {
        this.verifiedIfFollowing();
        this.isLoading = true;

        this.album = await SpotifyApi.getAlbum(this.$route.params.id_album);

        const { items: itemsAlbum } = await SpotifyApi.getAlbumsArtist(
          { include_groups: 'album,single' },
          { id: this.$route.params.id },
        );
        this.albums = itemsAlbum;

        const { artists } = await SpotifyApi.getRelatedArtist(
          this.$route.params.id,
        );
        this.related = artists;

        this.tracks = await getAllForPaginator(
          SpotifyApi.getAlbumTracks,
          {},
          { id: this.$route.params.id_album },
        );

        this.tracks = this.tracks.sort((a, b) => {
          if (a.track_number < b.track_number) {
            return -1;
          }
          if (a.track_number > b.track_number) {
            return 1;
          }
          return 0;
        });

        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#artistContent {
  .loadingContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .content {
    padding: 48px 0;

    h1 {
      font-size: 24px;
      padding: 0px 16px;

      @include md {
        font-size: 48px;
        padding: 0px 48px;
      }
    }

    > p {
      font-size: 16px;
      margin-bottom: 32px;
      padding: 0px 16px;
      margin-top: 16px;

      @include md {
        font-size: 24px;
        margin-bottom: 80px;
        padding: 0px 48px;
      }

      a {
        color: #fff;
        text-decoration: none;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
      }
    }

    h2 {
      margin-bottom: 16px;
      opacity: 0.7;
      font-size: 18px;
      font-weight: 500;
      display: inline-flex;

      @include md {
        margin-bottom: 24px;
        font-size: 24px;
      }
    }

    section {
      margin-bottom: 24px;

      @include md {
        margin-bottom: 40px;
      }
    }

    .sectionTracks {
      padding: 0 16px;

      @include md {
        padding: 0 48px;
      }
    }

    .sectionRelated,
    .sectionAlbum {
      h2 {
        padding-left: 16px;
        margin-bottom: 0px;

        @include md {
          padding-left: 48px;
        }
      }

      #carouselComponentContainer {
        @include md {
          margin-top: -80px;
        }
      }
    }
  }
}
</style>
