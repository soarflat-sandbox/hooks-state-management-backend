const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config/index.js');
const checkToken = require('./middlewares/checkToken');
const unknownEndpoint = require('./middlewares/unknownEndpoint');
const requestLogger = require('./middlewares/requestLogger');
const songs = require('./models/Song');

class Handler {
  static login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
      return;
    }

    if (username === mockedUsername && password === mockedPassword) {
      // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      // JsonWebToken を文字列で取得する
      const token = jwt.sign({ username: username }, config.secret, {
        expiresIn: '24h' // expires in 24 hours
      });
      // return the JWT token for the future API calls
      res.json({
        success: true,
        message: 'Authentication successful!',
        token,
        user: {
          firstName: 'Admin',
          lastName: 'User'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  }

  static getSongs(req, res) {
    res.json(songs);
  }
}

function main() {
  const app = express();
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.use(requestLogger);
  app.post('/api/login', Handler.login);
  app.get('/api/songs', checkToken, Handler.getSongs);
  app.use(unknownEndpoint);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
}

main();
