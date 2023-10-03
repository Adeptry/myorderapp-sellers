import { useAppBarHeight } from "./useAppBarHeight";

export function useFooterHeight(): number {
  return 57;
}

export function useHeaderAndFooterHeight(): number {
  const appBarHeight = useAppBarHeight();
  const footerHeight = useFooterHeight();
  return (appBarHeight ?? 0) + footerHeight;
}

export function useMaxHeightCssString(): string {
  return `calc(100vh - ${useHeaderAndFooterHeight()}px)`; // 57 is footer
}
