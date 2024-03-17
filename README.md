# @md/assert-console

Allows you to verify your console output matches expected behavior.

## How to use

```
import { assertConsole } from "@md/assert-console";

Deno.test(function example() {
  console.log("Hello");
  console.warn("World", "Number1");
  console.warn("World", "#2");
  console.error("!");

  assertConsole({
    log: [["Hello"]],
    warn: [
      ["World", "Number1"],
      ["World", "#2"],
    ],
    error: [["!"]],
  });
});
```