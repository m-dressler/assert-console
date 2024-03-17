import { assertEquals } from "@std/assert";

/** A call to the logger with 0-many arguments */
// deno-lint-ignore no-explicit-any
export type Log = any[];
/** An array of {@link Log}s broken down by "channel" */
export type LogHistory = { [key in "log" | "warn" | "error"]: Log[] };

/** The values by "channel" that were stored since the last assert */
const values: LogHistory = {
  log: [],
  warn: [],
  error: [],
};

/** Utility function as `forEach` for {@link values} since typescript doesn't perfectly infer `for(const key in obj)` key types */
const forEachChannel = (forEach: (callbackFn: keyof LogHistory) => void) => {
  for (const channel in values) forEach(channel as keyof LogHistory);
};

// Override the console channels with our capturing function
forEachChannel((channel) => {
  const override = (...args: Log) => values[channel].push(args);
  Object.defineProperty(console, channel, { value: override });
});

/**
 * Make an assertion that the values logged to the different channels since the last check match expected logs.
 *
 * @example
 * ```ts
 * Deno.test(function example() {
 *   console.log("Hello");
 *   console.warn("World", "Number1");
 *   console.warn("World", "#2");
 *   console.error("!");
 *
 *   assertConsole({
 *     log: [["Hello"]],
 *     warn: [
 *       ["World", "Number1"],
 *       ["World", "#2"],
 *     ],
 *     error: [["!"]],
 *   });
 * });
 * ```
 */
export const assertConsole = (expected: Partial<LogHistory>) => {
  // If unspecified, a channel is expected to have no logs
  forEachChannel((channel) => {
    if (expected[channel] === undefined) expected[channel] = [];
  });

  assertEquals(values, expected, "Logged lines don't match expected logs.");

  // Reset values as we successfully checked logs
  forEachChannel((channel) => (values[channel] = []));
};
