import { LoginResponseType } from "moa-merchants-ts-axios";
import { createContext } from "react";

export type SessionContextType = {
  session: LoginResponseType | null;
  setSession: (value: LoginResponseType | null) => void;
};

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);
