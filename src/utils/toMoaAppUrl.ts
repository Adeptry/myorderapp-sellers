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

import { moaEnv } from "../moaEnv";

export function toMoaPathComponent(name: string) {
  let processedPathComponent = name?.toLowerCase();

  // Remove leading and trailing whitespace
  processedPathComponent = processedPathComponent?.trim();

  // Replace spaces with hyphens
  processedPathComponent = processedPathComponent?.replace(/\s+/g, "-");

  // Remove all non-alphanumeric and non-hyphen characters
  processedPathComponent = processedPathComponent?.replace(
    /[^a-zA-Z0-9-]/g,
    ""
  );

  return processedPathComponent;
}

export function toMoaAppUrl(name: string) {
  return `${moaEnv.appUrl}/${toMoaPathComponent(name)}`;
}
