"use client";

import { MoaAdaptiveScaffold } from "@/components/layouts/MoaAdaptiveScaffold";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              <MoaAdaptiveScaffold>{children}</MoaAdaptiveScaffold>
            </QueryClientProvider>
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
