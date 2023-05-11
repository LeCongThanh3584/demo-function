import jwt from "jsonwebtoken";
require("dotenv").config();

const generateToken = (user) => {
  const userData = {
    id_user: user.id,
    email: user.email,
    role_id: user.role_id,
  };

  let access_token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  let refresh_token = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });

  return { access_token, refresh_token };
};

const generateTokenByEmail = (email) => {
  let token = jwt.sign(email, process.env.TOKEN_BY_EMAIL, {
    algorithm: "HS256",
    // expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
  return token;
};

const verifyJwt = (token, secret) => {
  try {
    const verified = jwt.verify(token, secret);
    return verified;
  } catch (e) {
    console.log("ERROR", e);
  }
};

const verifyAccessToken = (access_token) =>
  verifyJwt(access_token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (refresh_token) =>
  verifyJwt(refresh_token, process.env.REFRESH_TOKEN_SECRET);

const verifyTokenByEmail = (token_by_email) =>
  verifyJwt(token_by_email, process.env.TOKEN_BY_EMAIL);

module.exports = {
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenByEmail,
  verifyTokenByEmail,
};
