import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/jwt";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hash } });
  res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id)
  });
};

export const refresh = (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;
  res.json({ accessToken: createAccessToken(decoded.userId) });
};
