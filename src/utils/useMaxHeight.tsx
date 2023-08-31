import { useAppBarHeight } from "./useAppBarHeight";

export function useMaxHeightCssString(): string {
  const appBarHeight = useAppBarHeight();

  return `calc(100vh - ${appBarHeight ?? 0}px - 57px)`;
}
