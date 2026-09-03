"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconMenu, IconTooth, IconX } from "./icons";

const NAV_LINKS = [
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Perguntas frequentes", href: "#faq" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(250, 247, 241, 0)", "rgba(250, 247, 241, 0.92)"],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(228, 221, 205, 0)", "rgba(228, 221, 205, 1)"],
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      style={{ backgroundColor: background, borderColor }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#topo" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--soma-primary-800)] text-[var(--soma-gold-400)]">
            <IconTooth className="h-5 w-5" />
          </span>
          <span
            className="text-lg font-semibold tracking-tight text-[var(--soma-primary-900)]"
            style={{ fontFamily: "var(--font-soma-display)" }}
          >
            Soma Dental Studio
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--soma-ink-soft)] transition hover:text-[var(--soma-primary-800)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contato"
            className="rounded-full bg-[var(--soma-primary-800)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[var(--soma-primary-800)]/20 transition hover:bg-[var(--soma-primary-700)]"
          >
            Agendar avaliação
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--soma-line)] text-[var(--soma-primary-900)] lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--soma-line)] bg-[var(--soma-cream)] px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-[var(--soma-ink-soft)] transition hover:bg-[var(--soma-primary-100)] hover:text-[var(--soma-primary-800)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[var(--soma-primary-800)] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Agendar avaliação
            </a>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
