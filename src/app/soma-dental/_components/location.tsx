import { IconClock, IconMapPin, IconTooth } from "./icons";
import { Reveal } from "./reveal";

const HOURS = [
  { day: "Segunda a sexta", hours: "8h às 20h" },
  { day: "Sábado", hours: "9h às 14h" },
  { day: "Domingo", hours: "Fechado" },
];

export function Location() {
  return (
    <section id="localizacao" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--soma-primary-700)]">
            Localização
          </p>
          <h2
            className="mt-3 text-3xl text-[var(--soma-primary-950)] sm:text-4xl"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Fácil de chegar, perto de você
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-6 rounded-3xl border border-[var(--soma-line)] bg-white p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <IconMapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--soma-ink)]">Endereço</p>
                <p className="mt-1 text-sm text-[var(--soma-ink-soft)]">
                  Rua dos Ipês, 452 — Jardim das Flores
                  <br />
                  São Paulo — SP, 04532-100
                </p>
                <p className="mt-1 text-xs text-[var(--soma-ink-soft)]">
                  A 5 minutos do metrô Faria Lima, estacionamento conveniado no local.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-[var(--soma-line)] pt-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--soma-primary-100)] text-[var(--soma-primary-700)]">
                <IconClock className="h-5 w-5" />
              </span>
              <div className="w-full">
                <p className="text-sm font-semibold text-[var(--soma-ink)]">
                  Horário de atendimento
                </p>
                <ul className="mt-2 space-y-1.5">
                  {HOURS.map((item) => (
                    <li
                      key={item.day}
                      className="flex items-center justify-between text-sm text-[var(--soma-ink-soft)]"
                    >
                      <span>{item.day}</span>
                      <span className="font-medium text-[var(--soma-ink)]">{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Rua+dos+Ipes+452+Sao+Paulo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--soma-primary-800)]/25 px-6 py-3 text-sm font-semibold text-[var(--soma-primary-900)] transition hover:border-[var(--soma-primary-800)]/50"
            >
              Como chegar pelo Google Maps
            </a>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[320px] overflow-hidden rounded-3xl border border-[var(--soma-line)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--soma-primary-100)_0%,var(--soma-cream-deep)_45%,var(--soma-gold-100)_100%)]" />
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full text-[var(--soma-primary-800)]/15"
            >
              <defs>
                <pattern id="soma-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#soma-grid)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--soma-primary-800)] text-[var(--soma-gold-400)] shadow-lg">
                <IconTooth className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold text-[var(--soma-primary-900)]">
                Soma Dental Studio
              </p>
              <p className="max-w-xs text-xs text-[var(--soma-ink-soft)]">
                Mapa interativo disponível na versão final do site, integrado ao Google Maps.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
