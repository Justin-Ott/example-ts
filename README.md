# Willow DLS Example Repository

A learning-focused example repository demonstrating different testing strategies for digital logic circuits using [Willow DLS](https://github.com/willow-dls/core) and Jest.

## Quick Start

Clone this repository and install dependencies:

```bash
git clone https://github.com/willow-dls/example-ts.git
cd example-ts
npm install
npm test
```

## What's Included

This repository contains a 4-bit ripple-carry adder circuit from CircuitVerse with three different testing approaches. Each test file demonstrates a different testing philosophy.
<img width="953" height="539" alt="image" src="https://github.com/user-attachments/assets/d8c510ce-7ce6-4304-98ad-f33f2ca6b704" />


### Test Files

#### 1. **ripple-carry-table.test.ts** - Start Here!
A straightforward, table-driven test using specific values. This is the best file to read first if you're new to Willow testing.

**Why use this approach?**
- Easy to understand and modify
- Good for documentation-the test table doubles as a specification
- Perfect for testing known edge cases and important scenarios
- Minimal setup required

**What to learn:**
- How to structure basic test cases
- How to use Jest's `test.each()` for parameterized tests
- What kinds of cases matter (zero, overflow, wraparound)

**Example:**
```typescript
const testCases = [
  { a: "0000", b: "0000", expectedSum: "0000", description: "Zero plus zero" },
  { a: "0101", b: "0011", expectedSum: "1000", description: "Five plus three" },
];

test.each(testCases)("$description", ({ a, b, expectedSum }) => {
  // test body
});
```

#### 2. **ripple-carry-edge-cases.test.ts** - Learn Testing Patterns
Organized by testing category (boundary values, commutativity, overflow, etc.). Shows how to verify mathematical properties and circuit behavior.

**Why use this approach?**
- Verifies not just results, but patterns and properties
- More thorough than a simple table
- Documents expected circuit behavior through test organization
- Great for catching subtle bugs

**What to learn:**
- How to organize tests with `describe()` blocks
- How to test mathematical properties (commutativity, identity elements)
- How to verify overflow behavior explicitly
- Using loops within tests for related cases

**Example:**
```typescript
describe("Boundary Values", () => {
  test("should add zero to any value", () => {
    // Verifies the identity property of addition
  });
});
```

#### 3. **ripple-carry-exhaustive.test.ts** - Complete Coverage
Tests all 65,536 possible 4-bit additions by iterating through every combination.

**Why use this approach?**
- Absolute confidence in correctness-no case is left untested
- Excellent for critical circuits (ALUs, adders, etc.)
- Catches corner cases you might not think of
- Trade-off: Takes longer to run

**What to learn:**
- How to programmatically generate tests
- When exhaustive testing is justified
- Performance considerations with large test suites

**Example:**
```typescript
let a = BitString.low(4);
while (true) {
  let b = BitString.low(4);
  while (true) {
    const sum = a.add(b);
    test(`${a} + ${b} => ${sum}`, () => { /* ... */ });
    b = b.add("0001");
    if (b.equals("0000")) break;
  }
  a = a.add("0001");
  if (a.equals("0000")) break;
}
```

## How to Use This Repository

### For Learning
1. Start by reading **ripple-carry-table.test.ts**
2. Study **ripple-carry-edge-cases.test.ts** to see more advanced patterns
3. Review **ripple-carry-exhaustive.test.ts** to understand when comprehensive testing makes sense

### For Your Own Circuits
1. Export your circuit from CircuitVerse (or another supported simulator)
2. Place the `.cv` file in the `tests/` directory
3. Copy one of the test files and modify it for your circuit
4. Run `npm test` to verify your circuit works as expected

**Recommended workflow:**
- Start with the table-driven approach (file #1)
- Add edge case tests as you think of important scenarios (file #2)
- Consider exhaustive testing for critical circuits (file #3)

## Project Structure

```
.
├── tests/
│   ├── RippleCarrySplitter.cv          # The CircuitVerse circuit file
│   ├── ripple-carry-table.test.ts      # Table-driven tests
│   ├── ripple-carry-edge-cases.test.ts # Pattern-based tests
│   └── ripple-carry-exhaustive.test.ts # Exhaustive coverage tests
├── tsconfig.json                       # TypeScript configuration
├── babel.config.cjs                    # Jest/Babel configuration
├── package.json
└── README.md
```

## Running Tests

Run all tests:
```bash
npm test
```

Run a specific test file:
```bash
npm test ripple-carry-table.test.ts
```

Run tests in watch mode (re-run on file changes):
```bash
npm test -- --watch
```

## Key Willow DLS Concepts

### Loading a Circuit
```typescript
import { loadCircuit, CircuitVerseLoader } from "@willow-dls/core";

const circuit = await loadCircuit(
  CircuitVerseLoader,
  "path/to/circuit.cv",
  "Circuit Name"
);
```

### Running a Circuit
```typescript
const result = circuit.run({
  A: "0101",
  B: "0011",
  CarryIn: "0",
});

console.log(result.outputs.Output.toString()); // "1000"
```

### Working with BitStrings
```typescript
const bits = BitString.low(4);  // "0000"
const incremented = bits.add("0001"); // "0001"
```

## Next Steps

- Read the [Willow DLS documentation](https://github.com/willow-dls/core)
- Explore custom circuit elements and loaders
- Check out other example repositories for different testing patterns
- Contribute your own example tests back to the community

## Tips for Your Own Tests

- **Start simple.** Use table-driven tests first, then expand if needed.
- **Test edge cases.** Boundaries, maximum values, zeros, and wraparound.
- **Document your tests.** Good descriptions help others (and future you) understand what's being tested.
- **Use meaningful variable names.** Compare `a`, `b`, `carry` to `inputA`, `inputB`, `carryIn`.
- **Group related tests.** Use `describe()` blocks to organize by functionality.
- **Don't over-test.** Exhaustive testing is powerful but slow-use it selectively.

## License

This example repository is released under the MIT license, the same as Willow DLS.
