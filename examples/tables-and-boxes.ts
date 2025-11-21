import { Effect } from "effect";
import {
  displayBox,
  displayPanel,
  displayTable,
  runWithTUI,
} from "effect-cli-tui";

const program = Effect.gen(function* () {
  yield* displayTable(
    [
      { name: "effect-cli-tui", version: "2.0.0", author: "Paul Philp" },
      { name: "effect", version: "3.19.4", author: "Effect-TS" },
    ],
    {
      columns: [
        { key: "name", header: "Name" },
        { key: "version", header: "Version" },
        { key: "author", header: "Author" },
      ],
    }
  );

  yield* displayBox("This is a box with a rounded border.", {
    borderStyle: "rounded",
    title: "Information",
    padding: 1,
  });

  yield* displayPanel(
    "This is a panel, which is a box with a title.",
    "Panel Title"
  );
});

runWithTUI(program);
