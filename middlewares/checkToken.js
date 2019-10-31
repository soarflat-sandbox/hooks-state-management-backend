const jwt = require('jsonwebtoken');
const config = require('../config');

const checkToken = (req, res, next) => {
  // Express のヘッダーは自動でローワーケースになる
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.json({
      succes: false,
      message: 'This route requires authentication'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  // トークン（署名）有効かどうかチェックする
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Token is not valid'
      });
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

module.exports = checkToken;
