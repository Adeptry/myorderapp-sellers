import useLocalStorage from "./useLocalStorage";

export default function useAccessToken() {
  return useLocalStorage<string | null>(
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY!,
    null
  );
}
