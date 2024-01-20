const mongoose = require("mongoose");

const AnimeSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  discordUserId: {
    type: String,
    required: true,
  },
  anilistAnimeId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  discordChannelId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("animes", AnimeSchema);
