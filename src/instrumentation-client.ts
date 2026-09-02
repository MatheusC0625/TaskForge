// Cliente apenas — de propósito. O SDK de servidor do Sentry (Node/OpenTelemetry)
// corrompe o streaming SSR quando uma página busca dados de uma API externa
// (o selo de repositório do GitHub), confirmado via bisecção com a suíte e2e
// (button "Editar projeto" passa a existir duplicado no DOM). Ver README.
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
