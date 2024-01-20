const axios = require("axios");
const config = require("../config.json");

const consumetAxios = axios.default.create({
  baseURL: config.consumetApiBaseUrl,
});

exports.getAnimeDetailsByAnilistId = async (anilistId) => {
  const response = await consumetAxios.get(`/meta/anilist/data/${anilistId}`);

  if (response.data && response.data) {
    return response.data;
  }

  return null;
};

exports.getZoroAnimeByAnilistId = async (anilistId) => {
  const response = await consumetAxios.get(
    `/meta/anilist/info/${anilistId}?provider=zoro`
  );

  if (response.data && response.data.episodes) {
    const firstEpisode = response.data.episodes[0];
    if (
      !firstEpisode ||
      !firstEpisode.id ||
      !firstEpisode.id.includes("$episode$")
    )
      return null;
    const zoroAnimeId = firstEpisode.id.split("$episode$")[0];
    return zoroAnimeId;
  }

  return null;
};

exports.getZoroAnimeDetailsById = async (zoroAnimeId) => {
  const response = await consumetAxios.get(
    `/anime/zoro/info?id=${zoroAnimeId}`
  );

  if (response.data && response.data.episodes) {
    return response.data;
  }

  return null;
};
