import useSWRV from "swrv";
import SpotifyApi from "../services/SpotifyApi";

const useFetch = (route, accessToken, params) => {
  const spotifyApi = new SpotifyApi(accessToken)

  const { data, error } = useSWRV(route, spotifyApi.getAxios(route, params))
  return { data, error }
}

export default useFetch