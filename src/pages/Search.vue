<template>
  <main id="searchContainer">
    <form @submit="handleSearch" class="searchInput">
      <button @click="clearSearch" type="button"><PhXCircle /></button>
      <input v-model="search" type="text" placeholder="Sua Pesquisa" />
      <button type="submit"><PhArrowRight /></button>
    </form>

    <nav>
      <ul>
        <li v-for="menu in menus" :key="menu.searchTerm">
          <button
            @click="() => changeMenu(menu.searchTerm)"
            :class="activeMenu === menu.searchTerm ? 'active' : ''"
            type="button"
          >
            {{ menu.title }}
          </button>
        </li>
      </ul>
    </nav>
    <div v-if="activeMenu === 'track'">
      <section v-if="results.length" class="sectionPopular">
        <Track
          v-for="(track, index) in results"
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
    <div v-if="activeMenu === 'artist'">
      <section v-if="results.length" class="grid">
        <Card
          v-for="artist in results"
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
    <div v-if="activeMenu === 'album'">
      <section v-if="results.length" class="grid">
        <Card
          v-for="album in results"
          :key="album.id"
          :title="album.name"
          :subTitle="album.artists[0].name"
          :image="album.images[0].url"
          :isPlaying="contextPlayerUri === album.uri"
          :onClickPlay="() => playArtists(album.uri)"
          :linkRoute="`/app/artist/${album.artists[0].id}/album/${album.id}`"
        />
      </section>
    </div>

    <div v-if="activeMenu === 'playlist'">
      <section v-if="results.length" class="grid">
        <Card
          v-for="album in results"
          :key="album.id"
          :title="album.name"
          :subTitle="`${album.tracks.total} Músicas`"
          :image="album.images[0].url"
          :isPlaying="contextPlayerUri === album.uri"
          :onClickPlay="() => playArtists(album.uri)"
          :linkRoute="`/app/playlist/${album.id}`"
        />
      </section>
    </div>

    <div class="paginator">
      <button @click="() => handleSearchPage(page + 1)">Próxima</button>
    </div>
  </main>
</template>

<script>
import { PhArrowRight, PhXCircle } from 'phosphor-vue';
import Track from '../components/Track';
import Card from '../components/Card';
import SpotifyApi from '../services/SpotifyApi';
import { mapGetters, mapState } from 'vuex';
import artistImage from '../assets/artist.jpg';

export default {
  name: 'Search',
  components: { Track, Card, PhArrowRight, PhXCircle },
  watch: {
    accessToken: function () {
      this.init();
    },
    activeMenu: function () {
      this.results = [];
      this.handleSearchPage(1);
      this.page = 1;
    },
  },
  created: function () {
    this.init();
  },
  data: function () {
    return {
      related: [],
      menus: [
        { title: 'Música', searchTerm: 'track', attr: 'tracks' },
        { title: 'Artista', searchTerm: 'artist', attr: 'artists' },
        { title: 'Playlist', searchTerm: 'playlist', attr: 'playlists' },
        { title: 'Álbum', searchTerm: 'album', attr: 'albums' },
      ],
      activeMenu: 'track',
      artistImage,
      search: '',
      results: [],
      page: 1,
    };
  },
  computed: {
    ...mapState({
      accessToken: ({ spotify }) => spotify.accessToken,
      contextPlayerUri: ({ spotify }) => spotify.contextPlayerUri,
    }),
    ...mapGetters('spotify', ['nowInfo']),
  },
  methods: {
    playerPlay: SpotifyApi.playerPlay,
    playArtists: SpotifyApi.playArtists,

    searchSpotify: async function (page = 1, limit = 20) {
      const data = await SpotifyApi.search({
        q: this.search,
        type: this.activeMenu,
        limit,
        offset: (page - 1) * limit,
      });

      return data;
    },

    getAttrName: function (menu) {
      return this.menus.filter(item => item.searchTerm === menu)[0].attr;
    },

    handleSearch: async function (event) {
      event.preventDefault();
      const data = await this.searchSpotify(1);
      this.results = data[this.getAttrName(this.activeMenu)].items;
      this.page = 1;
    },

    handleSearchPage: async function (page) {
      const data = await this.searchSpotify(page);
      this.results = [
        ...this.results,
        ...data[this.getAttrName(this.activeMenu)].items,
      ];
      this.page = page;
    },
    clearSearch: function () {
      this.search = '';
      this.page = 1;
    },
    changeMenu: function (menu) {
      this.activeMenu = menu;
    },
    init: async function () {
      this.activeMenu = 'track';
    },
  },
};
</script>

<style lang="scss" scoped>
#searchContainer {
  padding: 48px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100%;

  @include md {
    padding: 48px;
  }

  .searchInput {
    display: flex;
    align-items: center;
    border-radius: 40px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 0px 24px;
    margin-bottom: 32px;
    margin-top: auto;
    transition: ease-in 0.2s all;

    button {
      color: rgba(255, 255, 255, 0.3);
      font-size: 32px;
      transition: ease 0.2s all;

      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }

    input {
      flex: 1;
      padding: 16px;
      border: none;
      background: none;
      color: #fff;
      font-size: 16px;

      @include md {
        font-size: 32px;
      }

      &:focus,
      &:active {
        border: none;
      }
    }
  }

  nav {
    margin-bottom: auto;
    min-height: 80px;

    ul {
      display: flex;
      align-items: flex-end;
      gap: 24px;

      li {
        button {
          color: #fff;
          font-weight: 400;
          font-size: 18px;
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

  .grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

    @include md {
      grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
    }
  }
}
</style>
