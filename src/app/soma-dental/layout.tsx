import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./soma.css";

const fraunces = Fraunces({
  variable: "--font-soma-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-soma-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soma Dental Studio | Odontologia com cuidado e precisão",
  description:
    "Clínica odontológica em São Paulo. Avaliação, planejamento e tratamento com tecnologia digital, atendimento humanizado e horários flexíveis. Agende sua avaliação.",
};

export default function SomaDentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} ${jakarta.variable} soma-page min-h-screen`}
      style={{ fontFamily: "var(--font-soma-sans)" }}
    >
      {children}
    </div>
  );
}
