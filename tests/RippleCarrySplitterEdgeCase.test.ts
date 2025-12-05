import { expect, beforeAll, test, describe } from "@jest/globals";
import { BitString, CircuitVerseLoader, Circuit, loadCircuit } from "@willow-dls/core";

let adder: Circuit;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "tests/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});

describe("Ripple-Carry Adder - Edge Cases & Patterns", () => {
  describe("Boundary Values", () => {
    test("should add zero to any value", () => {
      const testValues = ["0001", "0101", "1010", "1111"];
      
      testValues.forEach((val) => {
        const result = adder
          .run({
            A: val,
            B: "0000",
            CarryIn: "0",
          })
          .outputs.Output.toString();
        
        expect(result).toBe(val);
      });
    });

    test("should handle all zeros", () => {
      const result = adder
        .run({
          A: "0000",
          B: "0000",
          CarryIn: "0",
        })
        .outputs.Output.toString();

      expect(result).toBe("0000");
    });

    test("should handle all ones", () => {
      const result = adder
        .run({
          A: "1111",
          B: "1111",
          CarryIn: "0",
        })
        .outputs.Output.toString();

      expect(result).toBe("1110");
    });
  });

  describe("Commutativity (Addition Order)", () => {
    test("should produce same result regardless of operand order", () => {
      const testPairs = [
        ["0011", "0101"],
        ["1001", "0110"],
        ["0111", "1000"],
      ];

      testPairs.forEach(([a, b]) => {
        const result1 = adder
          .run({
            A: a,
            B: b,
            CarryIn: "0",
          })
          .outputs.Output.toString();

        const result2 = adder
          .run({
            A: b,
            B: a,
            CarryIn: "0",
          })
          .outputs.Output.toString();

        expect(result1).toBe(result2);
      });
    });
  });

  describe("Associativity Pattern", () => {
    test("adding incrementally should produce expected results", () => {
      // Start at 0, add 1 four times
      let current = BitString.low(4); // "0000"
      const expectedSequence = ["0000", "0001", "0010", "0011", "0100"];

      expectedSequence.forEach((expected) => {
        expect(current.toString()).toBe(expected);
        current = current.add("0001");
      });
    });
  });

  describe("Overflow Behavior", () => {
    test("should wrap around when exceeding 4-bit capacity", () => {
      const overflowCases = [
        { a: "1111", b: "0001", expected: "0000" }, // 15 + 1 = 0 (wrapped)
        { a: "1000", b: "1000", expected: "0000" }, // 8 + 8 = 0 (wrapped)
        { a: "1110", b: "0011", expected: "0001" }, // 14 + 3 = 1 (wrapped)
      ];

      overflowCases.forEach(({ a, b, expected }) => {
        const result = adder
          .run({
            A: a,
            B: b,
            CarryIn: "0",
          })
          .outputs.Output.toString();

        expect(result).toBe(expected);
      });
    });
  });

  describe("Pattern Verification", () => {
    test("adding same value to itself should double it (with wrap)", () => {
      const testValues = ["0001", "0010", "0011", "0100", "0111"];

      testValues.forEach((val) => {
        const result = adder
          .run({
            A: val,
            B: val,
            CarryIn: "0",
          })
          .outputs.Output.toString();

        const doubled = BitString.high(4).equals(val) 
          ? val // Can't easily construct from string, just verify the doubling result
          : new BitString(val).add(new BitString(val));
        
        // For simplicity, just verify doubling produces correct modulo 16 result
        const expectedDouble = (parseInt(val, 2) * 2) % 16;
        expect(parseInt(result, 2)).toBe(expectedDouble);
      });
    });
  });
});