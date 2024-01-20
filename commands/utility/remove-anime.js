const { SlashCommandBuilder } = require("discord.js");
const animeService = require("../../service/anime.service");
const ResponseFormatter = require("../../response-formatter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-anime")
    .setDescription("Remove anime from monitor list")
    .addStringOption((option) =>
      option
        .setName("anilist-id")
        .setDescription("Anilist id of the anime")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const anilistId =
      interaction.options.getString("anilist-id") ?? "No id provided";
    const username = interaction.user.username;

    const { error } = await animeService.removeAnime({
      anilistAnimeId: anilistId,
      username,
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
      content: ResponseFormatter.listWatchingAnime(animes, {
        showAnilistId: false,
      }),
      ephemeral: true,
    });
  },
};
