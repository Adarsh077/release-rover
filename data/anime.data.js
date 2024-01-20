const AnimeModel = require("../model/anime.model");

exports.addAnime = async ({
  username,
  anilistAnimeId,
  title,
  discordChannelId,
  discordUserId,
}) => {
  await AnimeModel.create({
    username,
    anilistAnimeId,
    title,
    discordChannelId,
    discordUserId,
  });
};

exports.removeAnime = async ({ username, anilistAnimeId }) => {
  await AnimeModel.findOneAndDelete({
    username,
    anilistAnimeId,
  });
};

exports.getAnimeList = async ({ username }) => {
  const allAnime = await AnimeModel.find({
    username,
  });

  return { animes: allAnime };
};

exports.getOne = async ({ username, anilistAnimeId }) => {
  const anime = await AnimeModel.findOne({
    username,
    anilistAnimeId,
  });

  return { anime };
};

exports.getAll = async () => {
  const animes = await AnimeModel.find();

  return { animes };
};
