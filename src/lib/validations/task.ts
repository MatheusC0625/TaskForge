import { z } from "zod";
import { PRIORITY_ORDER } from "@/lib/priority";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório.").max(200, "Título muito longo."),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(200, "Título muito longo.")
    .optional(),
  description: z.string().trim().max(5000, "Descrição muito longa.").optional().nullable(),
  priority: z.enum(PRIORITY_ORDER).optional(),
  dueDate: z.string().optional().nullable(),
});

export const subtaskSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório.").max(200, "Título muito longo."),
});

export const tagSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório.").max(30, "Nome muito longo."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida."),
});
