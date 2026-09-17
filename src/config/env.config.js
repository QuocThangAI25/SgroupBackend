import dotenv from "dotenv";
dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "sgroup_lms",
  },
  jwt: {
    secret:
      process.env.JWT_SECRET || "sgroup_super_secret_jwt_training_key_2026",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    // Bổ sung Secret & Thời gian hết hạn cho Refresh Token
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "sgroup_super_secret_refresh_key_2026",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};
