import { IconCheck, IconX } from "./icons";
import { Reveal } from "./reveal";

const PROBLEMS = [
  "Medo ou ansiedade só de pensar em ir ao dentista",
  "Tratamento que ficou pela metade em outra clínica",
  "Orçamento que muda depois que a consulta já começou",
  "Consultas corridas, sem tempo para tirar dúvidas",
];

const SOLUTIONS = [
  "Atendimento gentil, com sedação leve para quem tem receio",
  "Plano de tratamento completo, retomado do ponto em que parou",
  "Orçamento fechado e por escrito antes de qualquer procedimento",
  "Consultas com tempo dedicado para você entender cada etapa",
];

export function ProblemSolution() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Problema x solução
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Você se identifica com algum desses pontos?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.05} className="rounded-3xl border border-[var(--soma-line)] bg-white p-8">
            <h3 className="text-lg font-semibold text-[var(--soma-ink)]">
              O que costuma afastar as pessoas do dentista
            </h3>
            <ul className="mt-6 space-y-4">
              {PROBLEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--soma-ink-soft)]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <IconX className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.15}
            className="rounded-3xl border border-[var(--soma-primary-700)]/20 bg-[var(--soma-primary-950)] p-8 text-white"
          >
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-soma-display)" }}
            >
              Como a Soma Dental Studio resolve isso
            </h3>
            <ul className="mt-6 space-y-4">
              {SOLUTIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--soma-gold-400)]/20 text-[var(--soma-gold-400)]">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
