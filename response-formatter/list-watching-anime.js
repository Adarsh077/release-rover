const listWatchingAnime = (animes, options) => {
  options = Object.assign({ showAnilistId: false }, options);
  let response = `Watching ${animes.length} animes for you:`;

  response += `\n\n`;

  for (const index in animes) {
    const anime = animes[index];

    response += `${index}. ${anime.title}`;

    if (options.showAnilistId) {
      response += ` - \`\`${anime.anilistAnimeId}\`\``;
    }

    response += `\n`;
  }

  return response;
};

module.exports = listWatchingAnime;
