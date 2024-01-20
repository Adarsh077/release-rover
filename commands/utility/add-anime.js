const { SlashCommandBuilder } = require("discord.js");
const animeService = require("../../service/anime.service");
const ResponseFormatter = require("../../response-formatter");
const checkForNewEpisodes = require("../../check-for-new-episodes");

function extractNumberId(inputString) {
  // Regular expression to match the number ID in the given format
  const regex = /\/(\d+)\//;

  // Use the exec method to extract the matched number ID
  const match = regex.exec(inputString);

  // Check if there is a match and return the captured group (number ID)
  return match ? match[1] : null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-anime")
    .setDescription("Add an anime to get latest episodes updates")
    .addStringOption((option) =>
      option
        .setName("anilist-url")
        .setDescription("Anilist url of the anime")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.user.username;
    const discordUserId = interaction.user.id;
    const discordChannelId = interaction.channelId;
    const anilistUrl = interaction.options.getString("anilist-url");
    const anilistId = extractNumberId(anilistUrl);

    const { error, title } = await animeService.addAnime({
      anilistAnimeId: anilistId,
      username,
      discordChannelId,
      discordUserId,
    });

    if (error) {
      await interaction.followUp({
        content: error,
        ephemeral: true,
      });
      return;
    }

    const { animes, error: getAnimeError } = await animeService.getAllAnimeFor({
      username,
    });

    if (getAnimeError) {
      await interaction.followUp({
        content: error,
        ephemeral: true,
      });
      return;
    }

    await interaction.followUp({
      content: `${ResponseFormatter.listWatchingAnime(animes, {
        showAnilistId: false,
      })}\nWill send latest episode for ${title}.`,
      ephemeral: true,
    });

    checkForNewEpisodes(interaction.client);
  },
};
