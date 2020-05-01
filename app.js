const winston = require('winston');
const webpack = require('webpack');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const ScoreParser = require('./model/score-parser');
const PdfScoreExporter = require('./model/score-exporter').PdfScoreExporter;
const fs = require('fs');
const axios = require('axios');

const compiler = webpack({
   
})

const httpPort = 3000;

const app = express();
app.use(helmet());
app.use(express.static('browser'));
app.use(routes);

const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
   transports: [
      new winston.transports.Console()
   ]
});

process.on('exit', code => logger.warn("Shutting down"));

app.get('/', function (res, req) {
   res.sendFile('index.html');
});

app.get('/pdf', function (req, res) {
   data = req.query;
   console.log(data.url);

   axios.get(data.url)
      .then(function (response) {
         let score = new ScoreParser().parse(response.data);
         new PdfScoreExporter().export(score, fs.createWriteStream('browser/output.pdf'))
            .then(status => {
               console.log(`done: ${status}`);
               res.sendStatus(200);
            });
      });
});

app.listen(httpPort);
console.log(`Express started on port ${httpPort}`);