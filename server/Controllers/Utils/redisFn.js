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

const PASSWORD_RESET_OTP_TTL_SECONDS = 600; // 10 minutes
const PASSWORD_RESET_TOKEN_TTL_SECONDS = 600; // 10 minutes

const storePasswordResetOtp = async (email, data, expirationSeconds = PASSWORD_RESET_OTP_TTL_SECONDS) => {
  await client.setEx(`pwreset_otp:${email}`, expirationSeconds, JSON.stringify(data));
};

const getPasswordResetOtp = async (email) => {
  const raw = await client.get(`pwreset_otp:${email}`);
  return raw ? JSON.parse(raw) : null;
};

const deletePasswordResetOtp = async (email) => {
  await client.del(`pwreset_otp:${email}`);
};

const storePasswordResetToken = async (token, data, expirationSeconds = PASSWORD_RESET_TOKEN_TTL_SECONDS) => {
  await client.setEx(`pwreset_token:${token}`, expirationSeconds, JSON.stringify(data));
};

const getPasswordResetToken = async (token) => {
  const raw = await client.get(`pwreset_token:${token}`);
  return raw ? JSON.parse(raw) : null;
};

const deletePasswordResetToken = async (token) => {
  await client.del(`pwreset_token:${token}`);
};

module.exports = {
  storeRefreshToken,
  getRefreshTokenUserId,
  deleteRefreshToken,
  deleteAllUserTokens,
  storePasswordResetOtp,
  getPasswordResetOtp,
  deletePasswordResetOtp,
  storePasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
};
