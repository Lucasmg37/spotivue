import axios from "axios"

import localStorageConstants from "../constants/localStorage"

const api = axios.create({ baseURL: 'https://api.spotify.com/v1/' });

api.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + localStorage.getItem(localStorageConstants.ACCESS_TOKEN);
  return config;
})

export default class SpotifyApi {

  static async getMePlayer() {
    const { data } = await api.get('me/player');
    return data
  }

  static async getMe() {
    const { data } = await api.get('me');
    return data
  }

  static async transferUserPlayback(device_id) {
    const { data } = await api.put('me/player', { device_ids: [device_id], play: true });
    return data
  }

  static async playerPlay(context_uri = false, position = 0, uris = []) {

    const params = {};

    if (uris.length) {
      params.uris = uris;
    }

    if (context_uri) {
      params.context_uri = context_uri;
      params.offset = { position };
    }

    const { data } = await api.put('me/player/play', params);
    return data
  }

  static async playArtists(context_uri) {
    const { data } = await api.put('me/player/play', { context_uri });
    return data
  }

  static async playerNext() {
    const { data } = await api.post('me/player/next');
    return data
  }


  static async playerPrevious() {
    const { data } = await api.post('me/player/previous');
    return data
  }

  static async playerPause() {
    const { data } = await api.put('me/player/pause');
    return data
  }

  static async setRepeatMode(mode) {
    const { data } = await api.put('me/player/repeat', {}, { params: { state: mode } });
    return data
  }

  static async setVolume(volume_percent) {
    const { data } = await api.put('me/player/volume', {}, { params: { volume_percent } });
    return data
  }

  static async toogleShuffle(active) {
    const { data } = await api.put('me/player/shuffle', {}, { params: { state: active } });
    return data
  }

  static async userPlaylists(params = {}) {
    const { data } = await api.get('me/playlists', { params });
    return data
  }

  static async playlistTracks(params = {}, { playlistId }) {
    const { data } = await api.get('playlists/' + playlistId + '/tracks', { params });
    return data
  }

  static async getPlaylist(playlist_id) {
    const { data } = await api.get('playlists/' + playlist_id);
    return data
  }

  static async getArtist(artist_id) {
    const { data } = await api.get('artists/' + artist_id);
    return data
  }

  static async getTopTracks() {
    const { data } = await api.get('me/top/tracks');
    return data
  }

  static async getTopArtists() {
    const { data } = await api.get('me/top/artists');
    return data
  }

  static async getMeTracks(params = {}) {
    const { data } = await api.get('me/tracks', { params });
    return data
  }

  static async getArtistTopTracks(id, params = {}) {
    const { data } = await api.get('artists/' + id + '/top-tracks', { params });
    return data
  }

  static async getRelatedArtist(id, params = {}) {
    console.log(id, params)
    return {
      artists: []
    }
  }

  static async getAlbumsArtist(params = {}, { id }) {
    const { data } = await api.get('artists/' + id + '/albums', { params });
    return data
  }

  static async getAlbum(id) {
    const { data } = await api.get('albums/' + id);
    return data
  }

  static async getAlbumTracks(params = {}, { id }) {
    const { data } = await api.get('albums/' + id + '/tracks', { params });
    return data
  }

  static async getFollowing(params = {}) {
    const { data } = await api.get('me/following/', { params });
    return data
  }

  static async getSavedAlbums(params = {}) {
    const { data } = await api.get('me/albums', { params });
    return data
  }

  static async search(params = {}) {
    const { data } = await api.get('search', { params });
    return data
  }

  static async followArtist(type, ids = []) {
    const { data } = await api.put('me/following', { ids }, { params: { type } });
    return data
  }

  static async followPlaylist(idPlaylist) {
    const { data } = await api.put('playlists/' + idPlaylist + '/followers');
    return data
  }

  static async unFollowPlaylist(idPlaylist) {
    const { data } = await api.delete('playlists/' + idPlaylist + '/followers');
    return data
  }

  static async saveAlbum(ids = []) {
    const { data } = await api.put('me/albums', { ids });
    return data
  }

  static async removeAlbum(ids = []) {
    const { data } = await api.delete('me/albums', { data: { ids } });
    return data
  }

  static async unFollowArtist(type, ids = []) {
    const { data } = await api.delete('me/following', { params: { type }, data: { ids } });
    return data
  }

  static async saveTrack(tracksIds = []) {
    const { data } = await api.put('me/tracks', {}, { params: { ids: tracksIds } });
    return data
  }

}