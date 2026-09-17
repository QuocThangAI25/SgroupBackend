// src/utils/jwt.helper.js
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";

// Tạo Access Token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || "1d",
  });
};

// Tạo Refresh Token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret || config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn || "7d",
  });
};

// Xác thực Access Token (Dùng cho Middleware)
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

// Xác thực Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret || config.jwt.secret);
};
