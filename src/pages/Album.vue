<template>
  <Page>
    <main id="artistContent">
      <h1>Neste álbum</h1>

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
            subTitle=""
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
    </main>
    <Aside
      :image="album.images[0] ? album.images[0].url : artistImage"
      :onClickPlay="() => playerPlay(album.uri, 0)"
      :title="album.name"
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

export default {
  name: 'Album',
  components: { Page, Aside, Track, Card, Carousel },
  watch: {
    accessToken: function() {
      this.init();
    },
    $route: function() {
      this.init();
    },
    savedAlbums: function() {
      this.verifiedIfFollowing();
    },
  },
  created: function() {
    this.init();
  },
  data: function() {
    return {
      tracks: [],
      related: [],
      albums: [],
      artistImage,
      album: {},
      isFollowing: false,
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
    verifiedIfFollowing: function() {
      this.isFollowing = !!this.savedAlbums.filter(
        item => item.album.id === this.$route.params.id_album,
      ).length;
    },
    saveAlbum: async function() {
      if (this.isFollowing) {
        SpotifyApi.removeAlbum([this.$route.params.id_album]);
        this.removeSavedAlbums(this.$route.params.id_album);
      } else {
        SpotifyApi.saveAlbum([this.$route.params.id_album]);
        this.addSavedAlbums({ album: this.album });
      }
    },
    playAlbumRandom: async function() {
      const position = Math.trunc(Math.random() * (this.tracks.length + 1));
      await this.playerPlay(this.album.uri, position);
      SpotifyApi.toogleShuffle(true);
    },
    init: async function() {
      const pageScroll = document.getElementById('pageAsideContainer');
      pageScroll && pageScroll.scrollTo(0, 0);

      if (this.accessToken) {
        this.verifiedIfFollowing();

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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#artistContent {
  padding: 48px 0;

  nav {
    margin-bottom: 40px;
    min-height: 80px;
    padding: 0 48px;

    ul {
      display: flex;
      align-items: center;
      gap: 24px;

      li {
        button {
          color: #fff;
          font-weight: 400;
          font-size: 24px;
          opacity: 0.7;
          transition: ease-in 0.2s all;

          &.active {
            font-size: 40px;
            opacity: 1;
            font-weight: 800;
          }
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  h1 {
    font-size: 48px;
    margin-bottom: 80px;
    padding: 0px 48px;
  }

  h2 {
    margin-bottom: 24px;
    opacity: 0.7;
    font-size: 24px;
    font-weight: 500;
    display: inline-flex;
  }

  section {
    margin-bottom: 40px;
  }

  .sectionTracks {
    padding: 0 48px;
  }

  .sectionRelated,
  .sectionAlbum {
    h2 {
      padding-left: 48px;
    }

    #carouselComponentContainer {
      margin-top: -80px;
    }
  }
}
</style>
