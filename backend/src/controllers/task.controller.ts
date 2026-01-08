import { prisma } from "../prisma/client";

export const getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId }
  });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const task = await prisma.task.create({
    data: { ...req.body, userId: req.userId }
  });
  res.status(201).json(task);
};

export const toggleTask = async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { completed: !task.completed }
  });
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
