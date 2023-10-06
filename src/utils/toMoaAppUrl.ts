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
