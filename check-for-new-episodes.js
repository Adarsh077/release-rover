const { EmbedBuilder, userMention } = require("discord.js");
const ConsumetHelpers = require("./helpers/consumet.helpers");
const AnimeService = require("./service/anime.service");
const LastNotificationService = require("./service/last-notification.service");
const { DateTime } = require("luxon");

const sendNewEpisodeNotification = (client, data) => {
  const { discordChannelId, discordUserId, animeDetails } = data;

  const {
    cover,
    banner,
    title,
    url,
    color,
    episodeNumber,
    episodeTitle,
    episodeLink,
    status,
    episodeIsAdult,
    totalEpisodes,
    nextEpisode,
  } = animeDetails;

  const notificationEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`#${episodeNumber} ${episodeTitle}`)
    .setURL(episodeLink)
    .setAuthor({
      name: title,
      url: url,
    })
    .setThumbnail(cover)
    .addFields(
      { name: "Status", value: status, inline: true },
      { name: "Total Episodes", value: `${totalEpisodes}`, inline: true },
      { name: "18+", value: episodeIsAdult, inline: true }
    )
    .setImage(banner);

  if (nextEpisode) {
    notificationEmbed.setFooter({ text: `Next Episode: ${nextEpisode}` });
  }

  client.channels.cache.get(discordChannelId).send({
    content: `${userMention(`${discordUserId}`)}`,
    embeds: [notificationEmbed],
  });
};

const checkForNewEpisodes = async (client) => {
  const { animes } = await AnimeService.getAll();

  if (!animes || !animes.length) return;

  for (const anime of animes) {
    const animeDetails = await ConsumetHelpers.getAnimeDetailsByAnilistId(
      anime.anilistAnimeId
    );
    if (!animeDetails) {
      console.log(`Anime Details not found!`);
      continue;
    }

    const zoroAnimeId = await ConsumetHelpers.getZoroAnimeByAnilistId(
      anime.anilistAnimeId
    );
    if (!zoroAnimeId) {
      console.log(`zoroAnimeId not found!`);
      continue;
    }

    const zoroAnimeDetails = await ConsumetHelpers.getZoroAnimeDetailsById(
      zoroAnimeId
    );

    if (!zoroAnimeDetails) {
      console.log(`zoroAnimeDetails not found!`);
      continue;
    }

    const episodes = zoroAnimeDetails.episodes;

    episodes.sort((a, b) => b.number - a.number);

    const latestEpisode = episodes[0];

    const { lastNotification } =
      await LastNotificationService.getLastNotificationBy({
        anilistAnimeId: anime.anilistAnimeId,
        discordUserId: anime.discordUserId,
      });

    let shouldSendNotification = true;
    if (
      lastNotification &&
      lastNotification.episodeNumber === latestEpisode.number
    ) {
      shouldSendNotification = false;
    }

    if (!shouldSendNotification) {
      console.log(`Should not send notification!`);
      continue;
    }

    sendNewEpisodeNotification(client, {
      discordChannelId: anime.discordChannelId,
      discordUserId: anime.discordUserId,
      animeDetails: {
        cover: animeDetails.image,
        banner: animeDetails.cover,
        title: animeDetails.title.english,
        url: zoroAnimeDetails.url,
        color: animeDetails.color,
        episodeNumber: latestEpisode.number,
        episodeTitle: latestEpisode.title,
        episodeLink: latestEpisode.url,
        status: animeDetails.status,
        episodeIsAdult: animeDetails.isAdult ? "Yes" : "No",
        totalEpisodes: animeDetails.totalEpisodes,
        nextEpisode:
          animeDetails.nextAiringEpisode &&
          animeDetails.nextAiringEpisode.airingTime
            ? DateTime.fromMillis(
                animeDetails.nextAiringEpisode.airingTime * 1000
              ).toFormat("dd MMMM yyyy hh:mm:ss a")
            : null,
      },
    });

    LastNotificationService.saveLastNotification({
      anilistAnimeId: anime.anilistAnimeId,
      discordUserId: anime.discordUserId,
      episodeNumber: latestEpisode.number,
    });
  }
};

module.exports = checkForNewEpisodes;
