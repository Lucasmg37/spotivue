
import Login from '../pages/Login.vue';
import Auth from '../pages/Auth.vue';
import Player from '../pages/Player.vue';
import Home from '../pages/Home.vue';
import Playlist from '../pages/Playlist.vue';
import Artist from '../pages/Artist.vue';
import Album from '../pages/Album.vue';
import Search from '../pages/Search.vue';
import Playlists from '../pages/Playlists.vue';
import Wrapper from '../layout/Wrapper.vue';


const routes = [
  { path: '/', component: Player },
  { path: '/login', component: Login },
  { path: '/auth', component: Auth },
  {
    path: '/app', component: Wrapper, children: [
      { path: 'playlist', component: Playlists },
      { path: 'playlist/:id', component: Playlist },
      { path: 'artist/:id/album/:id_album', component: Album, name: 'Album' },
      { path: 'artist/:id', component: Artist, name: 'Artist' },
      { path: 'player', component: Player },
      { path: 'search', component: Search, name: 'Search' },
      { path: 'about', component: Search, name: 'About' },
      { path: '*', component: Home },
    ]
  },
  { path: '*', component: Login },

]

export default routes;