import { Reveal } from "./reveal";

const STATS = [
  { value: "12+", label: "anos de experiência clínica" },
  { value: "3.500+", label: "pacientes atendidos" },
  { value: "4,9/5", label: "avaliação média no Google" },
  { value: "98%", label: "dos pacientes indicam a clínica" },
];

export function SocialProof() {
  return (
    <section className="border-y border-[var(--soma-line)] bg-white/60 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--soma-ink-soft)]">
            A confiança de quem já passou pela Soma
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <p
                className="text-3xl text-[var(--soma-primary-800)] sm:text-4xl"
                style={{ fontFamily: "var(--font-soma-display)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[var(--soma-ink-soft)]">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
