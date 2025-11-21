import { Effect } from "effect";
import { runWithTUI, spinnerEffect } from "effect-cli-tui";

const program = Effect.gen(function* () {
  const task = Effect.sleep("2 seconds").pipe(Effect.as("Task complete!"));

  const result = yield* spinnerEffect("Running a task for 2 seconds...", task);

  yield* Effect.log(result);
});

runWithTUI(program);
