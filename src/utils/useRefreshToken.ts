import useLocalStorage from "./useLocalStorage";

export default function useRefreshToken() {
  return useLocalStorage<string | null>(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY!,
    null
  );
}
