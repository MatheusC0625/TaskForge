"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function upgradeToPro(): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.user.update({ where: { id: session.user.id }, data: { plan: "PRO" } });

  revalidatePath("/upgrade");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function downgradeToFree(): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.user.update({ where: { id: session.user.id }, data: { plan: "FREE" } });

  revalidatePath("/upgrade");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}
