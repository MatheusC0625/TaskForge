"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronDown } from "./icons";
import { Reveal } from "./reveal";

const FAQ_ITEMS = [
  {
    question: "A clínica atende convênios odontológicos?",
    answer:
      "Atendemos os principais convênios odontológicos da região, além de pacientes particulares. Entre em contato informando o seu plano para confirmarmos a cobertura antes da consulta.",
  },
  {
    question: "Quanto custa a avaliação inicial?",
    answer:
      "A avaliação inicial, com exame clínico e diagnóstico, é gratuita para novos pacientes. É nesse encontro que montamos o plano de tratamento e o orçamento fechado, sem compromisso.",
  },
  {
    question: "Tenho muito medo de dentista, e agora?",
    answer:
      "Isso é mais comum do que parece, e cuidamos disso com atenção: consultas com tempo maior, explicação de cada passo antes de começar e, quando necessário, sedação leve para o seu conforto.",
  },
  {
    question: "É possível parcelar o tratamento?",
    answer:
      "Sim. Depois da avaliação, apresentamos um orçamento fechado com opções de parcelamento que cabem no seu orçamento, sem taxas ou valores escondidos ao longo do tratamento.",
  },
  {
    question: "Vocês atendem em caso de urgência ou dor?",
    answer:
      "Sim, reservamos horários na agenda para atendimentos de urgência. Ligue ou chame no WhatsApp e faremos o possível para te encaixar no mesmo dia.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--soma-cream-deep)] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Perguntas frequentes
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Tudo o que você precisa saber antes de agendar
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={item.question} delay={index * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-[var(--soma-line)] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[var(--soma-ink)] sm:text-base">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]"
                    >
                      <IconChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--soma-ink-soft)]">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
