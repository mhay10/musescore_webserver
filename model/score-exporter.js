const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const axios = require('axios');
const fs = require('fs');

class ScoreExporter {
   constructor() {
      if (this.constructor === ScoreExporter) {
         throw new TypeError('Cannot construct parent abstract class');
      }
   }

   export() {

   }
}

class PdfScoreExporter extends ScoreExporter {
   constructor() {
      super();
   }

   export(score, writeable) {
      return new Promise((res, rej) => this._export(score, writeable, res));
   }

   _export(score, writeable, res) {
      this.getPageData(score)
         .then(data => {
            let doc = new PDFDocument({
               size: 'letter',
               layout: 'portrait',
               autoFirstPage: false
            });
            doc.pipe(writeable);
            data.forEach(image => {
               doc.addPage();
               if (score.vector) {
                  SVGtoPDF(doc, image.toString(), 0, 0, {preserveAspectRatio: 'XminYMid meet'});
               }
               else {
                  doc.image(image, 0, 0, {fit: [doc.page.width, doc.page.height]});
               }
            });
            doc.end();
            res("complete");
         });
   }

   getPageData(score) {
      return Promise.all(score.pageUrls().map(url =>
         axios.get(url, {responseType: 'arraybuffer'})
            .then(response => new Promise((res, rej) => res(response.data))))
      );
   }
}

module.exports = {
   ScoreExporter: ScoreExporter,
   PdfScoreExporter: PdfScoreExporter
}