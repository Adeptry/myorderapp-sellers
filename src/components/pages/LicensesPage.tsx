"use client";

import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { Container } from "@mui/material";
import licenses from "../../utils/licenses.json";

export function LicensesPage() {
  const maxHeightCssString = useMaxHeightCssString();

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <h1>Licenses</h1>
      <ul>
        {Object.keys(licenses).map((key) => (
          <li key={key}>
            <strong>{key}</strong>: {(licenses as any)[key].licenses}
          </li>
        ))}
      </ul>
    </Container>
  );
}
