/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
