import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome do projeto é obrigatório.")
    .max(80, "O nome pode ter no máximo 80 caracteres."),
  description: z
    .string()
    .trim()
    .max(500, "A descrição pode ter no máximo 500 caracteres.")
    .optional(),
});

export const columnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da coluna é obrigatório.")
    .max(40, "O nome pode ter no máximo 40 caracteres."),
});
