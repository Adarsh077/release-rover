const { SlashCommandBuilder } = require("discord.js");
const animeService = require("../../service/anime.service");
const ResponseFormatter = require("../../response-formatter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-anime-list")
    .setDescription("Get list of all anime that are being watched for you")
    .addBooleanOption((option) =>
      option
        .setName("show-anilist-id")
        .setDescription("Wether to show anilist-id or not")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const showAnilistId =
      interaction.options.getBoolean("show-anilist-id") ?? false;

    const username = interaction.user.username;

    const { animes, error } = await animeService.getAllAnimeFor({ username });
    if (error) {
      await interaction.followUp({
        content: error,
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: ResponseFormatter.listWatchingAnime(animes, { showAnilistId }),
        ephemeral: true,
      });
    }
  },
};
