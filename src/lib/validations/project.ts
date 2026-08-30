import { z } from "zod";

const GITHUB_REPO_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

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
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida.")
    .optional(),
  githubRepoUrl: z
    .string()
    .trim()
    .regex(GITHUB_REPO_URL_REGEX, "Informe uma URL válida, ex: https://github.com/usuario/repositorio")
    .optional()
    .or(z.literal("")),
});

export const columnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da coluna é obrigatório.")
    .max(40, "O nome pode ter no máximo 40 caracteres."),
});
