const Entities = require('html-entities').AllHtmlEntities;
const Score = require('./score');

class ScoreParser {
   parse(pageSource) {
      let encodedScoreData = this.extractScoreData(pageSource);
      let scoreData = this.decodeScoreData(encodedScoreData);
      return this.constructScore(scoreData);
   }

   decodeScoreData(encodedScoreData) {
      return JSON.parse(new Entities().decode(encodedScoreData));
   }

   constructScore(scoreData) {
      let score = new Score();

      let pageData = scoreData.store.page.data.score;
      score.id = pageData.id;
      score.title = pageData.title;
      score.userId = pageData.user.id;
      score.pageCount = pageData.pages_count;
      score.baseUrl = scoreData.store.jmuse_settings.score_player.urls.image_path;
      score.vector = scoreData.store.jmuse_settings.score_player.render_vector;

      return score;
   }

   extractScoreData(pageSource) {
      let encodedScoreData =
         pageSource.replace(/.*<div[^>]*class\s*=\s*"[^"]*js-store[^"]*"\s*data-content="([^"]*)".*/s, '$1')
      return encodedScoreData;
   }
}

module.exports = ScoreParser;