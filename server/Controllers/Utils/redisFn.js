const client = require("../../Config/redis.js");

const storeRefreshToken = async (token, userId, expirationSeconds = 604800) => {
  await client.setEx(`refreshToken:${token}`, expirationSeconds, userId);
  await client.sAdd(`user_tokens:${userId}`, token);
  await client.expire(`user_tokens:${userId}`, expirationSeconds);
};

const getRefreshTokenUserId = async (token) => {
  return await client.get(`refreshToken:${token}`);
};

const deleteRefreshToken = async (token) => {
  const userId = await client.get(`refreshToken:${token}`);
  if (userId) {
    await client.del(`refreshToken:${token}`);
    await client.sRem(`user_tokens:${userId}`, token);
  }
};

const deleteAllUserTokens = async (userId) => {
  const tokens = await client.sMembers(`user_tokens:${userId}`);
  if (tokens.length > 0) {
    const pipeline = client.pipeline();
    tokens.forEach((token) => {
      pipeline.del(`refreshToken:${token}`);
      pipeline.sRem(`user_tokens:${userId}`, token);
    });
    await pipeline.exec();
    await client.del(`user_tokens:${userId}`);
  }
};

module.exports = {
  storeRefreshToken,
  getRefreshTokenUserId,
  deleteRefreshToken,
  deleteAllUserTokens,
};
