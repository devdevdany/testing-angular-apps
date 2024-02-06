import { makeEnvironmentProviders } from "@angular/core";
import { INITIAL_THEME, type Theme, ThemeService } from "./theme.service";

function themeServiceFactory(initialTheme: Theme) {
  return new ThemeService(initialTheme);
}

export function provideTheme(initialTheme: Theme) {
  return makeEnvironmentProviders([
    {
      provide: ThemeService,
      useFactory: themeServiceFactory,
      deps: [INITIAL_THEME],
    },
    {
      provide: INITIAL_THEME,
      useValue: initialTheme,
    },
  ]);
}
