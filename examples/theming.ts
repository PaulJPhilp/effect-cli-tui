import { Effect } from "effect";
import {
  display,
  displayError,
  displayInfo,
  displaySuccess,
  displayWarning,
  runWithTUI,
  TUIHandler,
} from "effect-cli-tui";
import { ThemeService, themes } from "effect-cli-tui/theme";

const program = Effect.gen(function* () {
  const tui = yield* TUIHandler;
  const themeService = yield* ThemeService;

  yield* displayInfo("Welcome to the theme previewer!");

  while (true) {
    const themeName = yield* tui.select("Choose a theme to preview", [
      { value: "default", name: "Default" },
      { value: "minimal", name: "Minimal" },
      { value: "dark", name: "Dark" },
      { value: "emoji", name: "Emoji" },
      { value: "exit", name: "Exit" },
    ]);

    if (themeName === "exit") {
      break;
    }

    const theme = themes[themeName as keyof typeof themes];
    yield* themeService.setTheme(theme);

    yield* display(`Previewing the '${themeName}' theme:`);
    yield* displaySuccess("This is a success message.");
    yield* displayError("This is an error message.");
    yield* displayWarning("This is a warning message.");
    yield* displayInfo("This is an info message.");
  }

  yield* display("Exiting theme previewer.");
});

runWithTUI(program);
