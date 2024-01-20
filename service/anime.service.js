const animeDataLayer = require("../data/anime.data");
const { request, gql } = require("graphql-request");

const getAnimeById = gql`
  query ($id: Int) {
    # Define which variables will be used in the query (id)
    Media(id: $id, type: ANIME) {
      # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      id
      title {
        romaji
        english
        native
      }
    }
  }
`;

exports.addAnime = async ({
  username,
  anilistAnimeId,
  discordChannelId,
  discordUserId,
}) => {
  try {
    const { anime } = await animeDataLayer.getOne({
      anilistAnimeId,
      username,
    });

    if (anime) {
      return { error: null, title: anime.title };
    }

    const variables = {
      id: anilistAnimeId,
    };
    const response = await request({
      url: "https://graphql.anilist.co",
      document: getAnimeById,
      variables,
    });

    await animeDataLayer.addAnime({
      anilistAnimeId,
      title: response.Media.title.english,
      username,
      discordChannelId,
      discordUserId,
    });

    return { error: null, title: response.Media.title.english };
  } catch (error) {
    console.log(error);
    return { error: "Anime not found!" };
  }
};

exports.getAllAnimeFor = async ({ username }) => {
  try {
    const { animes } = await animeDataLayer.getAnimeList({
      username,
    });

    if (!animes || !animes.length) {
      return { error: "No Anime added yet!" };
    }

    return { animes };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};

exports.getAll = async () => {
  try {
    const { animes } = await animeDataLayer.getAll();

    return { animes };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};

exports.removeAnime = async ({ username, anilistAnimeId }) => {
  try {
    await animeDataLayer.removeAnime({
      username,
      anilistAnimeId,
    });

    return { status: "success" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
