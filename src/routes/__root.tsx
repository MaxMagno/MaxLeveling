import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { GameProvider } from "@/lib/game/store";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="panel panel-neon p-8 text-center max-w-md">
        <div className="chip mb-3">Error 404</div>
        <h1 className="font-display text-3xl mb-2">Ruta fuera del sistema</h1>
        <p className="text-sm text-muted-foreground mb-6">Este nodo no existe en MaxLeveling.</p>
        <Link to="/" className="text-neon font-display tracking-widest text-sm">← Volver al sistema</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="panel p-8 text-center max-w-md">
        <h1 className="font-display text-xl mb-2">Fallo del sistema</h1>
        <p className="text-sm text-muted-foreground mb-6">Algo falló al cargar este nodo.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="text-neon font-display tracking-widest text-sm">Reintentar</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MaxLeveling — Sistema de progresión" },
      { name: "description", content: "Misiones diarias, XP, racha y afinidad. Eleva tu nivel cada día." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Outlet />
      </GameProvider>
    </QueryClientProvider>
  );
}
