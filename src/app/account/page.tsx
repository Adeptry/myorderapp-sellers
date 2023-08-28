"use client";

import { Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "../routes";

export default function Page() {
  const { push } = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      push(routes.signin);
    }
  }, [status]);
  return (
    <Stack spacing={2} py={2}>
      <Typography>Hello, account.</Typography>
    </Stack>
  );
}
