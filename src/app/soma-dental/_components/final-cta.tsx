import { IconCalendar } from "./icons";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="px-6 pb-24">
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--soma-primary-800)] via-[var(--soma-primary-900)] to-[var(--soma-primary-950)] px-8 py-14 text-center text-white sm:px-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--soma-gold-400)]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--soma-gold-400)]">
          Agenda limitada esta semana
        </span>
        <h2
          className="mx-auto mt-6 max-w-2xl text-3xl leading-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-soma-display)" }}
        >
          Só temos algumas vagas de avaliação gratuita disponíveis nos próximos dias.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Garanta agora o seu horário e dê o primeiro passo para o sorriso que você
          quer — sem compromisso, sem letras miúdas.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contato"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[var(--soma-primary-900)] shadow-lg transition hover:bg-[var(--soma-cream)]"
          >
            <IconCalendar className="h-4 w-4" />
            Quero garantir minha vaga
          </a>
        </div>
      </Reveal>
    </section>
  );
}
