"use client";

import { motion } from "framer-motion";
import { IconCalendar, IconStar, IconWhatsapp } from "./icons";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--soma-primary-500)]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-80 w-80 rounded-full bg-[var(--soma-gold-400)]/25 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--soma-gold-400)]/60 bg-[var(--soma-gold-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--soma-gold-600)]"
          >
            Clínica odontológica em São Paulo
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl leading-[1.08] text-[var(--soma-primary-950)] sm:text-5xl lg:text-[3.4rem]"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Seu sorriso merece cuidado, técnica e{" "}
            <span className="text-[var(--soma-primary-600)]">acolhimento</span> em um só lugar.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--soma-ink-soft)]"
          >
            Na Soma Dental Studio unimos odontologia de precisão a um atendimento
            humano e sem pressa, para você recuperar a confiança no seu sorriso —
            com um plano de tratamento claro, sem surpresas no orçamento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#contato"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--soma-primary-800)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--soma-primary-800)]/25 transition hover:bg-[var(--soma-primary-700)]"
            >
              <IconCalendar className="h-4 w-4" />
              Agendar avaliação gratuita
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--soma-primary-800)]/25 bg-white px-7 py-3.5 text-sm font-semibold text-[var(--soma-primary-900)] transition hover:border-[var(--soma-primary-800)]/50"
            >
              <IconWhatsapp className="h-4 w-4 text-[var(--soma-primary-700)]" />
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex items-center gap-3 text-sm text-[var(--soma-ink-soft)]"
          >
            <div className="flex items-center gap-0.5 text-[var(--soma-gold-500)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="h-4 w-4" />
              ))}
            </div>
            <span>
              <strong className="text-[var(--soma-primary-900)]">4,9/5</strong> em mais de
              300 avaliações de pacientes
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--soma-primary-700)] via-[var(--soma-primary-800)] to-[var(--soma-primary-950)] shadow-2xl shadow-[var(--soma-primary-900)]/30">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 text-center text-white/90">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[var(--soma-gold-400)]">
                <IconStar className="h-8 w-8" />
              </span>
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Odontologia Soma
              </p>
              <p
                className="text-2xl leading-snug"
                style={{ fontFamily: "var(--font-soma-display)" }}
              >
                Planejamento digital do sorriso, do primeiro exame ao resultado.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-6 -left-6 w-56 rounded-2xl border border-[var(--soma-line)] bg-white p-4 shadow-xl sm:-left-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--soma-primary-700)]">
              Pacientes atendidos
            </p>
            <p
              className="mt-1 text-2xl text-[var(--soma-primary-950)]"
              style={{ fontFamily: "var(--font-soma-display)" }}
            >
              +3.500
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
