<template>
  <Page>
    <main id="artistContent">
      <nav>
        <ul>
          <li v-for="menu in menus" :key="menu">
            <button
              @click="() => changeMenu(menu)"
              :class="activeMenu === menu ? 'active' : ''"
              type="button"
            >
              {{ menu }}
            </button>
          </li>
        </ul>
      </nav>
      <div v-if="activeMenu === 'Resumo'">
        <section v-if="popularTracks.length" class="sectionPopular">
          <h2>Popular</h2>
          <Track
            v-for="(track, index) in popularTracks.slice(0, 5)"
            :key="track.id"
            :index="index + 1"
            :onPlay="() => playerPlay(false, 0, [track.uri])"
            :isPlaying="track.id === nowInfo.id"
            :trackName="track.name"
            :albumName="track.album.name"
            :artistName="track.artists[0].name"
            :trackDuration="track.duration_ms"
          />
        </section>
        <section v-if="albums.length" class="sectionAlbum">
          <h2>Álbuns</h2>
          <Carousel>
            <Card
              v-for="album in albums.slice(0, 10)"
              :key="album.id"
              :title="album.name"
              subTitle=""
              :image="album.images[0].url"
              :isPlaying="contextPlayerUri === album.uri"
              :onClickPlay="() => playArtists(album.uri)"
              :linkRoute="`/app/artist/${artist.id}/album/${album.id}`"
            />
          </Carousel>
        </section>
        <section v-if="singles.length" class="sectionSingle">
          <h2>Singles</h2>
          <Carousel>
            <Card
              v-for="album in singles.slice(0, 10)"
              :key="album.id"
              :title="album.name"
              subTitle=""
              :image="album.images[0].url"
              :isPlaying="contextPlayerUri === album.uri"
              :onClickPlay="() => playArtists(album.uri)"
              :linkRoute="`/app/artist/${artist.id}/album/${album.id}`"
            />
          </Carousel>
        </section>
        <section v-if="appearsOn.length" class="sectionAppersOn">
          <h2>Aparece em</h2>
          <Carousel>
            <Card
              v-for="album in appearsOn.slice(0, 10)"
              :key="album.id"
              :title="album.name"
              :subTitle="album.artists[0].name"
              :image="album.images[0].url"
              :isPlaying="contextPlayerUri === album.uri"
              :onClickPlay="() => playArtists(album.uri)"
              :linkRoute="`/app/artist/${artist.id}/album/${album.id}`"
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

      <div v-if="activeMenu === 'Popular'">
        <section v-if="popularTracks.length" class="sectionPopular">
          <Track
            v-for="(track, index) in popularTracks"
            :key="track.id"
            :index="index + 1"
            :onPlay="() => playerPlay(false, 0, [track.uri])"
            :isPlaying="track.id === nowInfo.id"
            :trackName="track.name"
            :albumName="track.album.name"
            :artistName="track.artists[0].name"
            :trackDuration="track.duration_ms"
          />
        </section>
      </div>

      <div v-if="activeMenu === 'Álbuns'">
        <section v-if="albums.length" class="grid">
          <Card
            v-for="album in albums"
            :key="album.id"
            :title="album.name"
            :subTitle="album.artists[0].name"
            :image="album.images[0].url"
            :isPlaying="contextPlayerUri === album.uri"
            :onClickPlay="() => playArtists(album.uri)"
            :linkRoute="`/app/artist/${artist.id}/album/${album.id}`"
          />
        </section>
      </div>

      <div v-if="activeMenu === 'Singles'">
        <section v-if="singles.length" class="grid">
          <Card
            v-for="album in singles"
            :key="album.id"
            :title="album.name"
            :subTitle="album.artists[0].name"
            :image="album.images[0].url"
            :isPlaying="contextPlayerUri === album.uri"
            :onClickPlay="() => playArtists(album.uri)"
            :linkRoute="`/app/artist/${artist.id}/album/${album.id}`"
          />
        </section>
      </div>
      <div v-if="activeMenu === 'Relacionados'">
        <section v-if="related.length" class="grid">
          <Card
            v-for="artist in related"
            :key="artist.id"
            :title="artist.name"
            subTitle=""
            :image="artist.images[0] ? artist.images[0].url : artistImage"
            :isPlaying="contextPlayerUri === artist.uri"
            :isImageRouded="true"
            :onClickPlay="() => playArtists(artist.uri)"
            :linkRoute="`/app/artist/${artist.id}`"
          />
        </section>
      </div>
    </main>
    <Aside
      :image="artist.images[0] ? artist.images[0].url : artistImage"
      :onClickPlay="() => playArtists(artist.uri)"
      :title="artist.name"
      :showFollowButton="true"
      :isFollowing="isFollowing"
      :onClickFollow="followArtist"
      :subTitle="`${
        artist.followers && getFormattedFollowers(artist.followers.total)
      } seguidores`"
      :options="[
        {
          name: 'random',
          action: playArtistRandom,
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
import { getFormattedFollowers } from '../utils/follow';
import artistImage from '../assets/artist.jpg';
import { getAllForPaginator } from '../utils/spotifyRequests';

export default {
  name: 'Artist',
  components: { Page, Aside, Track, Card, Carousel },
  watch: {
    accessToken: function () {
      this.init();
    },
    $route: function () {
      this.init();
    },
    followingArtists: function () {
      this.verifiedIfFollowing();
    },
  },
  created: function () {
    this.init();
  },
  data: function () {
    return {
      artist: {},
      popularTracks: [],
      related: [],
      appearsOn: [],
      singles: [],
      albums: [],
      menus: ['Resumo', 'Popular', 'Álbuns', 'Singles', 'Relacionados'],
      activeMenu: 'Resumo',
      artistImage,
      isFollowing: false,
    };
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      contextPlayerUri: ({ spotify }) => spotify.contextPlayerUri,
      followingArtists: ({ spotify }) => spotify.followingArtists,
    }),
    ...mapGetters('spotify', ['nowInfo']),
  },
  methods: {
    ...mapMutations('spotify', ['addFollowArtist', 'removeFollowArtist']),
    playerPlay: SpotifyApi.playerPlay,
    playArtists: SpotifyApi.playArtists,
    playArtistRandom: async function () {
      await SpotifyApi.playArtists(this.artist.uri);
      SpotifyApi.toogleShuffle(true);
    },
    getFormattedFollowers,
    verifiedIfFollowing: function () {
      this.isFollowing = !!this.followingArtists.filter(
        item => item.id === this.$route.params.id,
      ).length;
    },
    changeMenu: function (menu) {
      this.activeMenu = menu;
    },

    followArtist: async function () {
      if (!this.isFollowing) {
        await SpotifyApi.followArtist('artist', [this.$route.params.id]);
        this.addFollowArtist({ id: this.$route.params.id });
      } else {
        await SpotifyApi.unFollowArtist('artist', [this.$route.params.id]);
        this.removeFollowArtist(this.$route.params.id);
      }
    },
    init: async function () {
      const pageScroll = document.getElementById('pageAsideContainer');
      pageScroll && pageScroll.scrollTo(0, 0);

      this.activeMenu = 'Resumo';

      if (this.accessToken) {
        this.verifiedIfFollowing();

        this.artist = await SpotifyApi.getArtist(this.$route.params.id);
        this.albums = await getAllForPaginator(
          SpotifyApi.getAlbumsArtist,
          { include_groups: 'album' },
          { id: this.$route.params.id },
        );

        this.singles = await getAllForPaginator(
          SpotifyApi.getAlbumsArtist,
          { include_groups: 'single' },
          { id: this.$route.params.id },
        );

        const { items: itemsAppearsOn } = await SpotifyApi.getAlbumsArtist(
          { include_groups: 'appears_on' },
          { id: this.$route.params.id },
        );

        this.appearsOn = itemsAppearsOn;

        const { artists } = await SpotifyApi.getRelatedArtist(
          this.$route.params.id,
        );
        this.related = artists;
        const { tracks } = await SpotifyApi.getArtistTopTracks(
          this.$route.params.id,
          {
            market: 'BR',
          },
        );
        this.popularTracks = tracks;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#artistContent {
  padding: 48px 0;

  nav {
    margin-bottom: 8px;
    min-height: 80px;
    padding: 0 16px;
    max-width: 100%;
    overflow: auto;

    @include md {
      padding: 0 48px;
      margin-bottom: 40px;
    }

    ul {
      display: flex;
      align-items: flex-end;
      gap: 24px;

      li {
        button {
          color: #fff;
          font-weight: 400;
          font-size: 20px;
          opacity: 0.7;
          transition: ease-in 0.2s all;

          @include md {
            font-size: 24px;
          }

          &.active {
            font-size: 32px;
            opacity: 1;
            font-weight: 800;

            @include md {
              font-size: 40px;
            }
          }
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  h2 {
    margin-bottom: 16px;
    opacity: 0.7;
    font-size: 18px;
    font-weight: 500;
    display: inline-flex;

    @include md {
      font-size: 24px;
      margin-bottom: 24px;
    }
  }

  section {
    margin-bottom: 24px;

    @include md {
      margin-bottom: 40px;
    }
  }

  .grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    padding: 0 16px;

    @include md {
      padding: 0 48px;
      grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
    }
  }

  .sectionPopular {
    padding: 0 16px;

    @include md {
      padding: 0 48px;
    }
  }

  .sectionRelated,
  .sectionAlbum,
  .sectionAppersOn,
  .sectionSingle {
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
</style>
