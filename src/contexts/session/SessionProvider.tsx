"use client";

import { LoginResponseType } from "moa-merchants-ts-axios";
import React, { useEffect, useState } from "react";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import { SessionContext, SessionContextType } from "./SessionContext";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useLocalStorage<LoginResponseType | null>(
    "session",
    null
  );
  const isClient = useIsClient();

  const [context, setContext] = useState<SessionContextType>({
    session: isClient ? session : null,
    setSession,
  });

  useEffect(() => {
    console.log("Updating context...");
    setContext({
      session: isClient ? session : null,
      setSession,
    });
  }, [session]);

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}
