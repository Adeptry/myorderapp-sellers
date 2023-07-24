"use client";

import { routes } from "@/app/routes";
import { SignInLayout } from "@/components/layouts/SignInLayout";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  return (
    <Container component="main" maxWidth="xs">
      <SignInLayout
        onSuccess={() => {
          push(routes.configurator);
        }}
      />
    </Container>
  );
}
