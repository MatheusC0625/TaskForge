import { IconMapPin, IconPhone, IconTooth, IconWhatsapp } from "./icons";

const LINKS = [
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Perguntas frequentes", href: "#faq" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--soma-line)] bg-[var(--soma-primary-950)] py-14 text-white/70">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--soma-gold-400)]">
                <IconTooth className="h-5 w-5" />
              </span>
              <span
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-soma-display)" }}
              >
                Soma Dental Studio
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Odontologia de precisão com atendimento humanizado. Cuidando do seu
              sorriso com técnica e acolhimento.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Navegação</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contato</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 shrink-0" />
                (11) 4002-8922
              </li>
              <li className="flex items-center gap-2">
                <IconWhatsapp className="h-4 w-4 shrink-0" />
                (11) 99999-9999
              </li>
              <li className="flex items-start gap-2">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Rua dos Ipês, 452 — São Paulo, SP
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Horário</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Segunda a sexta — 8h às 20h</li>
              <li>Sábado — 9h às 14h</li>
              <li>Domingo — Fechado</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Soma Dental Studio. Todos os direitos reservados.</p>
          <p>Responsável técnico: Dr(a). [Nome] — CRO-SP [00000]</p>
        </div>
      </div>
    </footer>
  );
}
