const mongoose = require("mongoose");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const schedule = require("node-schedule");
const { token } = require("./config.json");
const registerCommands = require("./register-commands");
const checkForNewEpisodes = require("./check-for-new-episodes");
const config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

mongoose.connect(config.mongodb).then(() => console.log("DB connected!!"));

registerCommands(client);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // client.channels.cache
  //   .get("1197964105819103397")
  //   .send({ content: `${userMention("945268596714663976")} hello!` });
  checkForNewEpisodes(client);
});

schedule.scheduleJob("0 * * * *", function () {
  checkForNewEpisodes(client);
});

client.login(token);
