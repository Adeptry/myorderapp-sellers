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

import { RegisterOptions } from "react-hook-form";

export function getBooleanNullOrThrow(
  value: string | boolean | null | undefined
): boolean | null {
  if (typeof value === "boolean") {
    return value;
  } else if (typeof value === "string") {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else {
      throw new Error(
        `this radio group is supposed to only manage string boolean values ("true", "false"), or can optionally be null.`
      );
    }
  } else if (value == null) {
    return null;
  } else {
    throw new Error(
      `this radio group is supposed to only manage string boolean values ("true", "false"), or can optionally be null.`
    );
  }
}

export const reactHookFormBooleanRadioGroupRegisterOptions = {
  setValueAs: getBooleanNullOrThrow,
} as RegisterOptions;
