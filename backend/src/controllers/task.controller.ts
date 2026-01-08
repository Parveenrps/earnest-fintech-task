import type { Response } from "express";
import prisma from "../prisma/client.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { page = 1, limit = 10, status, search } = req.query;

  const where: any = { userId };
  if (status !== undefined) where.status = status === "true";
  if (search) where.title = { contains: search as string, mode: "insensitive" };

  const tasks = await prisma.task.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: [
       { createdAt: "desc" }
      ],
  });

  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = await prisma.task.create({ data: { title, description, userId } });
  res.status(201).json(task);
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { title, description },
  });
  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Task deleted successfully" });
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { status: !task.status },
  });
  res.json(updated);
};
