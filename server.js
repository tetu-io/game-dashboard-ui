const https = require('https');
const path = require('path');

const cors = require('cors');
const express = require('express');
const favicon = require('express-favicon');
const helmet = require('helmet');

cors({credentials: true, origin: true});

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.disable('x-powered-by');

app.use(favicon(__dirname + '/dist/tetu-game-dashboard/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist/tetu-game-dashboard')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/tetu-game-dashboard/index.html'));
});

app.listen(port);
