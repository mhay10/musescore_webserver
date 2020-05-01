class Score {
   id;
   title;
   userId;
   pageCount;
   baseUrl;
   vector = false;
                                                                                                                         ª
   pageUrls() {
      let urls = [];
      let extension = this.vector ? "svg" : "png";
      for (let i = 0; i < this.pageCount; i++) {
         urls.push(`${this.baseUrl}score_${i}.${extension}`);
      }
      return urls;
   }
}

module.exports = Score;