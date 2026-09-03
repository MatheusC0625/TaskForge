import {
  IconCalendar,
  IconScan,
  IconShield,
  IconSparkle,
  IconTooth,
  IconWallet,
} from "./icons";
import { Reveal } from "./reveal";

const BENEFITS = [
  {
    icon: IconShield,
    title: "Atendimento humanizado",
    description:
      "Consultas com tempo dedicado, sem pressa, para explicar cada etapa do tratamento e tirar todas as suas dúvidas.",
  },
  {
    icon: IconScan,
    title: "Tecnologia digital",
    description:
      "Scanner intraoral e radiografia digital, com menos radiação e um planejamento muito mais preciso do seu sorriso.",
  },
  {
    icon: IconTooth,
    title: "Odontologia sem dor",
    description:
      "Técnicas de anestesia mais confortáveis e sedação leve para pacientes com receio ou ansiedade odontológica.",
  },
  {
    icon: IconSparkle,
    title: "Planejamento digital do sorriso",
    description:
      "Você visualiza o resultado esperado antes de começar, com um plano de tratamento claro e por etapas.",
  },
  {
    icon: IconWallet,
    title: "Parcelamento facilitado",
    description:
      "Orçamento fechado por escrito, com condições de pagamento que cabem no seu bolso, sem taxas escondidas.",
  },
  {
    icon: IconCalendar,
    title: "Horários flexíveis",
    description:
      "Atendimento também à noite e aos sábados, pensado para quem trabalha em horário comercial.",
  },
];

export function Benefits() {
  return (
    <section id="diferenciais" className="bg-[var(--soma-cream-deep)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Diferenciais
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Cuidado completo, do primeiro contato ao seu novo sorriso
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <Reveal
              key={benefit.title}
              delay={(i % 3) * 0.08}
              className="rounded-2xl border border-[var(--soma-line)] bg-white p-7 transition hover:shadow-lg hover:shadow-[var(--soma-primary-900)]/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <benefit.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-[var(--soma-ink)]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--soma-ink-soft)]">
                {benefit.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
