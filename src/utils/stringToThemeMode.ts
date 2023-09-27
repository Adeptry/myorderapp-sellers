import { ThemeModeEnum } from "myorderapp-square";

export function stringToThemeMode(
  themeModeString?: string | null
): ThemeModeEnum {
  switch (themeModeString) {
    case "dark":
      return ThemeModeEnum.Dark;
    case "light":
      return ThemeModeEnum.Light;
    default:
      return ThemeModeEnum.System;
  }
}
