import { expect, beforeAll, test } from "@jest/globals";
import { BitString, CircuitVerseLoader, Circuit, loadCircuit } from "@willow-dls/core";

let adder: Circuit;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "tests/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});

// Test cases with specific values representing common scenarios
const testCases = [
  // { a, b, carryIn, expectedSum, description }
  { a: "0000", b: "0000", expectedSum: "0000", description: "Zero plus zero" },
  { a: "0001", b: "0000", expectedSum: "0001", description: "One plus zero" },
  { a: "0001", b: "0001", expectedSum: "0010", description: "One plus one" },
  { a: "0111", b: "0001", expectedSum: "1000", description: "Seven plus one (overflow)" },
  { a: "1111", b: "0001", expectedSum: "0000", description: "Max value plus one (wrap around)" },
  { a: "1111", b: "1111", expectedSum: "1110", description: "Max value plus max value" },
  { a: "0101", b: "0011", expectedSum: "1000", description: "Five plus three" },
  { a: "1010", b: "0101", expectedSum: "1111", description: "Ten plus five" },
  { a: "0100", b: "1100", expectedSum: "0000", description: "Four plus twelve (wrap)" },
  { a: "1001", b: "0110", expectedSum: "1111", description: "Nine plus six" },
];

test.each(testCases)(
  "Table-driven: $a + $b => $expectedSum ($description)",
  ({ a, b, expectedSum, description }) => {
    const result = adder
      .run({
        A: a,
        B: b,
        CarryIn: "0",
      })
      .outputs.Output.toString();

    expect(result).toBe(expectedSum);
  }
);