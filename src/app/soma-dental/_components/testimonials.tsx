import { IconStar } from "./icons";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  {
    name: "Marina Costa",
    treatment: "Clareamento e lentes de contato dental",
    quote:
      "Eu tinha muito medo de dentista e adiava minhas consultas há anos. Na Soma fui recebida com calma, entendi cada etapa do tratamento e hoje sorrio sem vergonha nas fotos.",
    initials: "MC",
  },
  {
    name: "Roberto Alencar",
    treatment: "Implante dentário",
    quote:
      "Fiz orçamento em outras clínicas e sempre tinha um valor a mais depois. Aqui o plano de tratamento veio fechado, por escrito, e foi exatamente o que paguei do início ao fim.",
    initials: "RA",
  },
  {
    name: "Juliana Prado",
    treatment: "Ortodontia e acompanhamento de rotina",
    quote:
      "Trabalho o dia inteiro e consegui encaixar as consultas à noite sem faltar ao trabalho. Equipe atenciosa e sempre no horário marcado.",
    initials: "JP",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Depoimentos
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Quem já se tratou com a gente conta como foi
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal
              key={testimonial.name}
              delay={i * 0.1}
              className="flex flex-col rounded-3xl border border-[var(--soma-line)] bg-white p-7"
            >
              <div className="flex items-center gap-0.5 text-[var(--soma-gold-500)]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <IconStar key={idx} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-[var(--soma-ink-soft)]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-[var(--soma-line)] pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--soma-primary-100)] text-sm font-semibold text-[var(--soma-primary-800)]">
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--soma-ink)]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[var(--soma-ink-soft)]">{testimonial.treatment}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
