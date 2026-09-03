"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { IconCheck, IconMail, IconPhone, IconWhatsapp } from "./icons";
import { Reveal } from "./reveal";

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id="contato" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Contato
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Vamos cuidar do seu sorriso?
          </h2>
          <p className="mt-4 text-[var(--soma-ink-soft)]">
            Preencha o formulário ou fale diretamente com a nossa equipe. Respondemos
            em até 1 dia útil.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="space-y-4">
            <a
              href="tel:+551140028922"
              className="flex items-center gap-4 rounded-2xl border border-[var(--soma-line)] bg-white p-5 transition hover:border-[var(--soma-primary-700)]/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <IconPhone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--soma-ink)]">Telefone</p>
                <p className="text-sm text-[var(--soma-ink-soft)]">(11) 4002-8922</p>
              </div>
            </a>

            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-[var(--soma-line)] bg-white p-5 transition hover:border-[var(--soma-primary-700)]/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <IconWhatsapp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--soma-ink)]">WhatsApp</p>
                <p className="text-sm text-[var(--soma-ink-soft)]">(11) 99999-9999</p>
              </div>
            </a>

            <a
              href="mailto:contato@somadental.com.br"
              className="flex items-center gap-4 rounded-2xl border border-[var(--soma-line)] bg-white p-5 transition hover:border-[var(--soma-primary-700)]/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <IconMail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--soma-ink)]">E-mail</p>
                <p className="text-sm text-[var(--soma-ink-soft)]">contato@somadental.com.br</p>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl border border-[var(--soma-line)] bg-white p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                  <IconCheck className="h-6 w-6" />
                </span>
                <p
                  className="text-xl text-[var(--soma-primary-950)]"
                  style={{ fontFamily: "var(--font-soma-display)" }}
                >
                  Recebemos sua mensagem!
                </p>
                <p className="max-w-sm text-sm text-[var(--soma-ink-soft)]">
                  Nossa equipe entrará em contato em breve para confirmar sua avaliação
                  gratuita.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="text-xs font-semibold text-[var(--soma-ink)]">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Seu nome"
                    className="mt-2 w-full rounded-xl border border-[var(--soma-line)] bg-[var(--soma-cream)] px-4 py-3 text-sm text-[var(--soma-ink)] outline-none transition focus:border-[var(--soma-primary-600)]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-[var(--soma-ink)]">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="(11) 90000-0000"
                    className="mt-2 w-full rounded-xl border border-[var(--soma-line)] bg-[var(--soma-cream)] px-4 py-3 text-sm text-[var(--soma-ink)] outline-none transition focus:border-[var(--soma-primary-600)]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="reason" className="text-xs font-semibold text-[var(--soma-ink)]">
                    Motivo da consulta
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    className="mt-2 w-full rounded-xl border border-[var(--soma-line)] bg-[var(--soma-cream)] px-4 py-3 text-sm text-[var(--soma-ink)] outline-none transition focus:border-[var(--soma-primary-600)]"
                    defaultValue="avaliacao"
                  >
                    <option value="avaliacao">Avaliação gratuita</option>
                    <option value="urgencia">Urgência / dor</option>
                    <option value="estetica">Estética do sorriso</option>
                    <option value="ortodontia">Ortodontia</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-xs font-semibold text-[var(--soma-ink)]">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Conte um pouco sobre o que você precisa"
                    className="mt-2 w-full resize-none rounded-xl border border-[var(--soma-line)] bg-[var(--soma-cream)] px-4 py-3 text-sm text-[var(--soma-ink)] outline-none transition focus:border-[var(--soma-primary-600)]"
                  />
                </div>
                <button
                  type="submit"
                  className="sm:col-span-2 rounded-full bg-[var(--soma-primary-800)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--soma-primary-700)]"
                >
                  Quero agendar minha avaliação
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
