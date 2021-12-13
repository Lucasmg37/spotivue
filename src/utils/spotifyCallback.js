import { toParams } from "./urlUtils";

export const getParamsFromSpotifyCallback = (location) => {
  let typeAuthorization = 'code';
  if (location.hash) {
    typeAuthorization = 'token';
  }

  let params = {};
  if (typeAuthorization === 'token') {
    params = toParams(location.hash.replace(/^#/, ''));
  } else {
    params.code = location.href.split('?')[1] ? location.href.split('?')[1].replace('code=', '') : null;
  }
  return params;
}