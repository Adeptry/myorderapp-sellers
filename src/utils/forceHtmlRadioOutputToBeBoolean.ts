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
