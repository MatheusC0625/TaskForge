import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LandingPage } from "./landing-page";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return <LandingPage />;
}
