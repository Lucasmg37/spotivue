import SpotifyApi from '../../services/SpotifyApi'
import { getAllForPaginator, getAllForMagicAttr } from '../../utils/spotifyRequests';
import { milesecsToMinutes } from '../../utils/time';

const state = () => ({
  accessToken: "",
  device: false,
  now: false,
  player: null,
  authError: false,
  activeDevice: {},
  playerActive: false,
  isPlaying: false,
  contextPlayerUri: '',
  savedTracksUser: [],
  savedAlbums: [],
  playlistsUser: [],
  topTracks: [],
  topArtists: [],
  followingArtists: [],
  idArtistCurrent: false
})

const getters = {
  nowInfo: (state) => {
    if (state.now) {
      const durationStr = milesecsToMinutes(state.now.duration);
      const positionStr = milesecsToMinutes(state.now.position);
      const positionPerCent = Math.trunc(state.now.position * 100 / state.now.duration);
      return {
        ...state.now,
        durationStr,
        positionStr,
        positionPerCent
      }
    }
    return false;
  },
  isCurrentTrackSaved: (state) => {
    return !!state.savedTracksUser.filter(track => (track.track.id === state.now.id)).length
  }
}

const actions = {

  async getAllLikedTracks({ commit }) {
    const allData = await getAllForPaginator(SpotifyApi.getMeTracks);
    commit('setSavedTracks', allData)
  },

  async getAllSavedAlbums({ commit }) {
    const allData = await getAllForPaginator(SpotifyApi.getSavedAlbums);
    commit('setSavedAlbums', allData)
  },

  async getAllPlaylists({ commit }) {
    const allData = await getAllForPaginator(SpotifyApi.userPlaylists);
    commit('setPlaylistsUser', allData)
  },

  async getAllFollowingArtists({ commit }) {
    const allData = await getAllForMagicAttr(SpotifyApi.getFollowing, { type: 'artist' }, {}, 'artists');
    commit('setFollowingArtists', allData)
  },

  async getTopTracks({ commit }) {
    const { items } = await SpotifyApi.getTopTracks();
    commit('setTopTracks', items)
  },

  async getTopArtists({ commit }) {
    const { items } = await SpotifyApi.getTopArtists();
    commit('setTopArtists', items)
  },

  updateProgress({ commit, state }) {
    commit('setNow', {
      ...state.now,
      position: state.now.position + 1000 >= state.now.duration ? state.now.duration : state.now.position + 1000
    })
  },

  async getMePlayerAction({ commit }) {
    try {
      const data = await SpotifyApi.getMePlayer();

      if (data.device) {
        commit('setActiveDevice', data.device)
        commit('setNow', {
          albumName: data.item.album.name,
          albumThumb: data.item.album.images[0].url,
          artistName: data.item.artists[0].name,
          trackName: data.item.name,
        })
        commit('setIdArtistCurrent', data.item.artists[0].id);
      }
    } catch (err) { console.log(err.response) }
  },

  playerInit({ commit, state }) {

    const player = new window.Spotify.Player({
      name: "SpotiVue",
      getOAuthToken: (cb) => {
        cb(state.accessToken);
      },
    });

    player.on("player_state_changed", (dataState) => {

      console.log(dataState)

      if (dataState) {
        commit('setContextPlayerUri', dataState.context.uri)
        commit('setNow', {
          albumName: dataState.track_window.current_track.album.name,
          albumId: dataState.track_window.current_track.album.uri.replace("spotify:album:", ''),
          albumThumb: dataState.track_window.current_track.album.images[2].url,
          artistName: dataState.track_window.current_track.artists[0].name,
          artistId: dataState.track_window.current_track.artists[0].uri.replace("spotify:artist:", ''),
          trackName: dataState.track_window.current_track.name,
          id: dataState.track_window.current_track.id,
          shuffle: dataState.shuffle,
          repeatMode: dataState.repeat_mode,
          position: dataState.position,
          duration: dataState.duration,
          likedFromId: dataState.track_window.current_track.linked_from ? dataState.track_window.current_track.linked_from.id : dataState.track_window.current_track.id,
        })
        commit('setPlayerActive', true)
        commit('setPlaying', !dataState.paused)
        commit('setIdArtistCurrent', dataState.track_window.current_track.artists[0].uri.replace("spotify:artist:", ''));
      }
    });

    player.on("ready", (data) => {
      commit('setDevice', data.device_id)
    });

    player.on('authentication_error', () => {
      commit('setAuthError', true)
    });

    player.connect();

    commit('setPlayerInstance', player)
  },
}


const mutations = {
  setDevice(state, device) {
    state.device = device
  },

  setSavedTracks(state, tracks) {
    state.savedTracksUser = tracks
  },

  setSavedAlbums(state, savedAlbums) {
    state.savedAlbums = savedAlbums
  },

  setFollowingArtists(state, followingArtists) {
    state.followingArtists = followingArtists
  },

  setIdArtistCurrent(state, idArtistCurrent) {
    state.idArtistCurrent = idArtistCurrent
  },

  setPlaylistsUser(state, playlistsUser) {
    state.playlistsUser = playlistsUser
  },

  setTopTracks(state, topTracks) {
    state.topTracks = topTracks
  },

  setTopArtists(state, topArtists) {
    state.topArtists = topArtists
  },

  addSavedTracks(state, track) {
    state.savedTracksUser = [...state.savedTracksUser, track]
  },

  removeSavedTracks(state, trackId) {
    state.savedTracksUser = state.savedTracksUser.filter(track => track.track.id !== trackId)
  },

  addSavedPlaylist(state, playlist) {
    state.playlistsUser = [...state.playlistsUser, playlist]
  },

  removeSavedPlaylist(state, playlistId) {
    state.playlistsUser = state.playlistsUser.filter(playlist => playlist.id !== playlistId)
  },

  addSavedAlbums(state, album) {
    state.savedAlbums = [...state.savedAlbums, album]
  },

  removeSavedAlbums(state, albumId) {
    state.savedAlbums = state.savedAlbums.filter(album => album.album.id !== albumId)
  },

  addFollowArtist(state, artist) {
    state.followingArtists = [...state.followingArtists, artist]
  },

  removeFollowArtist(state, artistId) {
    state.followingArtists = state.followingArtists.filter(artist => artist.id !== artistId)
  },

  setContextPlayerUri(state, contextPlayerUri) {
    state.contextPlayerUri = contextPlayerUri
  },

  setPlaying(state, status) {
    state.isPlaying = status
  },

  setAuthError(state, status) {
    state.authError = status
  },

  setPlayerActive(state, status) {
    state.playerActive = status
  },

  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
  },

  setNow(state, nowData) {
    state.now = nowData
  },

  setPlayerInstance(state, player) {
    state.player = player
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}