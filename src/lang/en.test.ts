import { describe, expect, test, beforeEach, it } from "vitest";
import { Num2WordEN } from "./en";
import { CurrencyOptions } from "../types";

describe("Num2WordEN", () => {
  let converter: Num2WordEN;

  beforeEach(() => {
    converter = new Num2WordEN();
  });

  describe("toCardinal", () => {
    const testCases: Array<[number, string]> = [
      [0, "zero"],
      [1, "one"],
      [2, "two"],
      [11, "eleven"],
      [12, "twelve"],
      [21, "twenty one"],
      [100, "one hundred"],
      [101, "one hundred and one"],
      [999, "nine hundred and ninety nine"],
      [1000, "one thousand"],
      [1001, "one thousand and one"],
      [1234, "one thousand two hundred and thirty four"],
      [1000000, "one million"],
      [-1, "minus one"],
      [-999, "minus nine hundred and ninety nine"],
    ];

    test.each(testCases)('converts %i to "%s"', (input, expected) => {
      expect(converter.toCardinal(input)).toBe(expected);
    });

    it("throws error for non-number input", () => {
      expect(() => converter.toCardinal("123" as any)).toThrow(
        "Input must be a number"
      );
    });
  });

  describe("toOrdinal", () => {
    const testCases: Array<[number, string]> = [
      [1, "first"],
      [2, "second"],
      [3, "third"],
      [4, "fourth"],
      [11, "eleventh"],
      [21, "twenty first"],
      [100, "one hundredth"],
      [101, "one hundred and first"],
      [999, "nine hundred and ninety ninth"],
      [1000, "one thousandth"],
    ];

    test.each(testCases)('converts %i to "%s"', (input, expected) => {
      expect(converter.toOrdinal(input)).toBe(expected);
    });
  });

  describe("toOrdinalNum", () => {
    const testCases: Array<[number, string]> = [
      [1, "1st"],
      [2, "2nd"],
      [3, "3rd"],
      [4, "4th"],
      [11, "11th"],
      [12, "12th"],
      [13, "13th"],
      [21, "21st"],
      [22, "22nd"],
      [23, "23rd"],
      [24, "24th"],
      [100, "100th"],
      [101, "101st"],
      [102, "102nd"],
      [103, "103rd"],
      [104, "104th"],
      [111, "111th"],
      [112, "112th"],
      [113, "113th"],
      [1000, "1000th"],
    ];

    test.each(testCases)('converts %i to "%s"', (input, expected) => {
      expect(converter.toOrdinalNum(input)).toBe(expected);
    });
  });

  describe("toCurrency", () => {
    interface TestCase {
      value: number;
      options: CurrencyOptions;
      expected: string;
    }

    const testCases: TestCase[] = [
      { value: 1, options: { currency: "EUR" }, expected: "one euro" },
      { value: 2, options: { currency: "EUR" }, expected: "two euros" },
      {
        value: 1.5,
        options: { currency: "EUR" },
        expected: "one euro and fifty cents",
      },
      {
        value: 1.99,
        options: { currency: "EUR" },
        expected: "one euro and ninety nine cents",
      },
      {
        value: 2.05,
        options: { currency: "EUR" },
        expected: "two euros and five cents",
      },
      {
        value: -1.5,
        options: { currency: "EUR" },
        expected: "minus one euro and fifty cents",
      },
      { value: 1, options: { currency: "USD" }, expected: "one dollar" },
      { value: 2, options: { currency: "USD" }, expected: "two dollars" },
      {
        value: 1.5,
        options: { currency: "USD" },
        expected: "one dollar and fifty cents",
      },
      {
        value: 2.05,
        options: { currency: "USD" },
        expected: "two dollars and five cents",
      },
      {
        value: 1,
        options: { currency: "GBP" },
        expected: "one pound sterling",
      },
      {
        value: 2,
        options: { currency: "GBP" },
        expected: "two pounds sterling",
      },
      {
        value: 1.5,
        options: { currency: "GBP" },
        expected: "one pound sterling and fifty pence",
      },
      {
        value: 2.05,
        options: { currency: "GBP" },
        expected: "two pounds sterling and five pence",
      },
      // Test GTQ currency
      { value: 1, options: { currency: "GTQ" }, expected: "one quetzal" },
      { value: 2, options: { currency: "GTQ" }, expected: "two quetzales" },
      {
        value: 1.5,
        options: { currency: "GTQ" },
        expected: "one quetzal and fifty cents",
      },
      {
        value: 2.05,
        options: { currency: "GTQ" },
        expected: "two quetzales and five cents",
      },
      // Test specific GTQ amounts without zero cents
      {
        value: 7650,
        options: { currency: "GTQ" },
        expected: "seven thousand six hundred and fifty quetzales",
      },
      {
        value: 7650.0,
        options: { currency: "GTQ" },
        expected: "seven thousand six hundred and fifty quetzales",
      },
      {
        value: 3410,
        options: { currency: "GTQ" },
        expected: "three thousand four hundred and ten quetzales",
      },
      {
        value: 3410.0,
        options: { currency: "GTQ" },
        expected: "three thousand four hundred and ten quetzales",
      },
      {
        value: 2444,
        options: { currency: "GTQ" },
        expected: "two thousand four hundred and forty four quetzales",
      },
      {
        value: 2444.0,
        options: { currency: "GTQ" },
        expected: "two thousand four hundred and forty four quetzales",
      },
      // Test with explicit zero cents
      {
        value: 7650,
        options: { currency: "GTQ", showZeroCents: true },
        expected:
          "seven thousand six hundred and fifty quetzales and zero cents",
      },
      {
        value: 3410,
        options: { currency: "GTQ", showZeroCents: true },
        expected:
          "three thousand four hundred and ten quetzales and zero cents",
      },
      {
        value: 2444,
        options: { currency: "GTQ", showZeroCents: true },
        expected:
          "two thousand four hundred and forty four quetzales and zero cents",
      },
      // Test without cents
      {
        value: 1.5,
        options: { currency: "EUR", cents: false },
        expected: "one euro",
      },
      {
        value: 2.99,
        options: { currency: "USD", cents: false },
        expected: "two dollars",
      },
      // Test with different separator
      {
        value: 1.5,
        options: { currency: "EUR", separator: "with" },
        expected: "one euro with fifty cents",
      },
      {
        value: 2.05,
        options: { currency: "USD", separator: "with" },
        expected: "two dollars with five cents",
      },
    ];

    test.each(testCases)(
      "converts $value $options.currency to '$expected'",
      ({ value, options, expected }) => {
        expect(converter.toCurrency(value, options)).toBe(expected);
      }
    );

    it("throws error for unsupported currency", () => {
      expect(() => converter.toCurrency(1, { currency: "XXX" })).toThrow(
        "Currency XXX is not supported"
      );
    });

    it("throws error for non-numeric input", () => {
      expect(() => converter.toCurrency("1" as any)).toThrow(
        "Input must be a number"
      );
    });
  });
});
