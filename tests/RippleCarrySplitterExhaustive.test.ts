import { expect, beforeAll, test } from "@jest/globals";
import {BitString, CircuitVerseLoader, Circuit, loadCircuit} from "@willow-dls/core";

let adder; Circuit;

beforeAll(async () => {
  adder = await loadCircuit(
    CircuitVerseLoader,
    "tests/RippleCarrySplitter.cv",
    "4-Bit Ripple-Carry Adder"
  );
});

function genTest(a, b, sum) {
  return () => {
    expect(
      adder
        .run({
          A: a,
          B: b,
          CarryIn: "0",
        })
        .outputs.Output.toString(),
    ).toBe(sum.toString());
  };
}

let a = BitString.low(4);
let b = BitString.low(4);
while (true) {
  while (true) {
    const sum = a.add(b);

    test(`Exhaustive: ${a} + ${b} => ${sum}`, genTest(a, b, sum));

    b = b.add("0001");

    if (b.equals("0000")) {
      break;
    }
  }
  a = a.add("0001");

  if (a.equals("0000")) {
    break;
  }
}
