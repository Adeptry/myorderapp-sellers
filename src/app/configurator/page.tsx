"use client";

import { AppConfigForm } from "@/components/forms/AppConfigForm";
import { Stack } from "@mui/material";

export default function Page() {
  return (
    <Stack spacing={2} py={2}>
      <AppConfigForm onSuccess={() => {}} />
    </Stack>
  );
}
