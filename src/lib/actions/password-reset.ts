"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { getResendClient, getAppUrl } from "@/lib/resend";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import type { ActionState } from "@/lib/actions/projects";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "E-mail inválido." };
  }

  const ip = getClientIp(await headers());
  const { success } = await checkRateLimit("password-reset", ip);
  if (!success) {
    return { error: "Muitas tentativas. Tente novamente em alguns minutos." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        userId: user.id,
      },
    });

    const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;
    const resend = getResendClient();

    if (resend) {
      await resend.emails.send({
        from: "TaskForge <onboarding@resend.dev>",
        to: user.email,
        subject: "Redefinir sua senha no TaskForge",
        html: `<p>Olá, ${user.name}.</p><p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Se você não pediu essa redefinição, ignore este e-mail.</p>`,
      });
    } else {
      console.warn(
        "RESEND_API_KEY não configurada — e-mail de redefinição não enviado. Link:",
        resetUrl,
      );
    }
  }

  return {};
}

export async function resetPassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Link inválido ou expirado. Solicite uma nova redefinição." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {};
}
