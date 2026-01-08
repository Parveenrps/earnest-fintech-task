import jwt from "jsonwebtoken";

export const createAccessToken = (userId: string) =>
  jwt.sign({ userId }, process.env.ACCESS_SECRET!, { expiresIn: "15m" });

export const createRefreshToken = (userId: string) =>
  jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
