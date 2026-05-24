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
      { title: "MaxLeveling — Sistema de cazadores" },
      { name: "description", content: "Misiones diarias, XP, racha y afinidad. Eleva tu nivel cada día." },
      { property: "og:title", content: "MaxLeveling — Sistema de cazadores" },
      { name: "twitter:title", content: "MaxLeveling — Sistema de cazadores" },
      { property: "og:description", content: "Misiones diarias, XP, racha y afinidad. Eleva tu nivel cada día." },
      { name: "twitter:description", content: "Misiones diarias, XP, racha y afinidad. Eleva tu nivel cada día." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e6c86d8b-5ff4-4ff4-9d96-f542a14b3a7b/id-preview-1d643b1c--55ccbe2b-c1cb-4083-a9a1-e41d5bc01d22.lovable.app-1779650240295.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e6c86d8b-5ff4-4ff4-9d96-f542a14b3a7b/id-preview-1d643b1c--55ccbe2b-c1cb-4083-a9a1-e41d5bc01d22.lovable.app-1779650240295.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
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
