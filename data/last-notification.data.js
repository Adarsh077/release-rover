const LastNotificationModel = require("../model/last-notification.model");

exports.saveLastNotification = async ({
  discordUserId,
  anilistAnimeId,
  episodeNumber,
}) => {
  await LastNotificationModel.findOneAndUpdate(
    {
      discordUserId,
      anilistAnimeId,
    },
    { $set: { discordUserId, anilistAnimeId, episodeNumber } },
    { upsert: true }
  );
};

exports.getLastNotificationBy = async ({ discordUserId, anilistAnimeId }) => {
  const lastNotification = await LastNotificationModel.findOne({
    discordUserId,
    anilistAnimeId,
  });

  return { lastNotification };
};
