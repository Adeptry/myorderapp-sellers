import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

export function useCsrfToken(): string | undefined | null {
  const [csrfToken, setCsrfToken] = useState<string | null | undefined>(null);
  useEffect(() => {
    async function fetchCsrfToken() {
      const token = await getCsrfToken();
      setCsrfToken(token);
    }

    fetchCsrfToken();
  }, []);

  return csrfToken;
}
