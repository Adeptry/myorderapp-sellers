import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

export function useAppBarHeight(): number | undefined {
  const {
    mixins: { toolbar },
    breakpoints,
  } = useTheme();
  const toolbarDesktopQuery = breakpoints.up("sm");
  const toolbarLandscapeQuery = `${breakpoints.up(
    "xs"
  )} and (orientation: landscape)`;
  const isDesktop = useMediaQuery(toolbarDesktopQuery);
  const isLandscape = useMediaQuery(toolbarLandscapeQuery);

  let currentToolbarMinHeight: any;

  if (isDesktop && toolbar[toolbarDesktopQuery]) {
    currentToolbarMinHeight = toolbar[toolbarDesktopQuery];
  } else if (isLandscape && toolbar[toolbarLandscapeQuery]) {
    currentToolbarMinHeight = toolbar[toolbarLandscapeQuery];
  } else if (toolbar) {
    currentToolbarMinHeight = toolbar;
  }

  return currentToolbarMinHeight?.minHeight ?? 0;
}
