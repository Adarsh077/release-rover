const mongoose = require("mongoose");

const LastNotificationSchema = mongoose.Schema({
  discordUserId: {
    type: String,
    required: true,
  },
  anilistAnimeId: {
    type: String,
    required: true,
  },
  episodeNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("last-notifications", LastNotificationSchema);
