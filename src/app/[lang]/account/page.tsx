"use client";

import { routes } from "@/app/routes";
import { Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);
  return (
    <Stack spacing={2}>
      <Typography>Hello, account.</Typography>
    </Stack>
  );
}
