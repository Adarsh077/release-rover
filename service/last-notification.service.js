const LastNotificationDataLayer = require("../data/last-notification.data");

exports.saveLastNotification = async ({
  discordUserId,
  anilistAnimeId,
  episodeNumber,
}) => {
  await LastNotificationDataLayer.saveLastNotification({
    anilistAnimeId,
    discordUserId,
    episodeNumber,
  });
};

exports.getLastNotificationBy = async ({ discordUserId, anilistAnimeId }) => {
  const { lastNotification } =
    await LastNotificationDataLayer.getLastNotificationBy({
      anilistAnimeId,
      discordUserId,
    });

  return { lastNotification };
};
