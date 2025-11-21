import { Effect } from "effect";

const test = Effect.gen(function* () {
  console.log("Effect is working!");
});

export default Effect.runPromise(test);
