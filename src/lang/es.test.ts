import { describe, expect, test, beforeEach, it } from "vitest";
import { Num2WordES } from "./es";
import { CurrencyOptions } from "../types";

describe("Num2WordES", () => {
  let converter: Num2WordES;

  beforeEach(() => {
    converter = new Num2WordES();
  });

  describe("toCardinal", () => {
    const testCases: Array<[number, string]> = [
      [0, "cero"],
      [1, "uno"],
      [2, "dos"],
      [11, "once"],
      [12, "doce"],
      [21, "veintiuno"],
      [31, "treinta y uno"],
      [100, "cien"],
      [101, "ciento uno"],
      [199, "ciento noventa y nueve"],
      [200, "doscientos"],
      [210, "doscientos diez"],
      [999, "novecientos noventa y nueve"],
      [1000, "mil"],
      [1001, "mil uno"],
      [1234, "mil doscientos treinta y cuatro"],
      [1000000, "un millon"],
      [2000000, "dos millones"],
      [2000001, "dos millones uno"],
      [-1, "menos uno"],
      [-999, "menos novecientos noventa y nueve"],
    ];

    test.each(testCases)('convierte %i a "%s"', (input, expected) => {
      expect(converter.toCardinal(input)).toBe(expected);
    });

    it("lanza error para entrada no numérica", () => {
      expect(() => converter.toCardinal("123" as any)).toThrow(
        "Input must be a number"
      );
    });
  });

  describe("toOrdinal", () => {
    const testCases: Array<[number, string]> = [
      [1, "primero"],
      [2, "segundo"],
      [3, "tercero"],
      [4, "cuarto"],
      [11, "undécimo"],
      [21, "vigésimo primero"],
      [100, "centésimo"],
      [101, "centésimo primero"],
      [999, "noningentésimo nonagésimo noveno"],
      [1000, "milésimo"],
    ];

    test.each(testCases)('convierte %i a "%s"', (input, expected) => {
      expect(converter.toOrdinal(input)).toBe(expected);
    });
  });

  describe("toOrdinalNum", () => {
    const testCases: Array<[number, string]> = [
      [1, "1º"],
      [2, "2º"],
      [3, "3º"],
      [4, "4º"],
      [11, "11º"],
      [21, "21º"],
      [100, "100º"],
      [101, "101º"],
      [999, "999º"],
      [1000, "1000º"],
    ];

    test.each(testCases)('convierte %i a "%s"', (input, expected) => {
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
      { value: 1, options: { currency: "EUR" }, expected: "un euro" },
      { value: 2, options: { currency: "EUR" }, expected: "dos euros" },
      {
        value: 1.5,
        options: { currency: "EUR" },
        expected: "un euro con cincuenta céntimos",
      },
      {
        value: 1.99,
        options: { currency: "EUR" },
        expected: "un euro con noventa y nueve céntimos",
      },
      {
        value: 2.05,
        options: { currency: "EUR" },
        expected: "dos euros con cinco céntimos",
      },
      {
        value: -1.5,
        options: { currency: "EUR" },
        expected: "menos un euro con cincuenta céntimos",
      },
      { value: 1, options: { currency: "USD" }, expected: "un dólar" },
      { value: 2, options: { currency: "USD" }, expected: "dos dólares" },
      {
        value: 1.5,
        options: { currency: "USD" },
        expected: "un dólar con cincuenta centavos",
      },
      {
        value: 2.05,
        options: { currency: "USD" },
        expected: "dos dólares con cinco centavos",
      },
      {
        value: 1,
        options: { currency: "GBP" },
        expected: "un libra esterlina",
      },
      {
        value: 2,
        options: { currency: "GBP" },
        expected: "dos libras esterlinas",
      },
      {
        value: 1.5,
        options: { currency: "GBP" },
        expected: "un libra esterlina con cincuenta peniques",
      },
      {
        value: 2.05,
        options: { currency: "GBP" },
        expected: "dos libras esterlinas con cinco peniques",
      },
      // Test GTQ currency with decimal values (not affected by "exacto")
      {
        value: 1.5,
        options: { currency: "GTQ" },
        expected: "un quetzal con cincuenta centavos",
      },
      {
        value: 2.05,
        options: { currency: "GTQ" },
        expected: "dos quetzales con cinco centavos",
      },
      // Test specific GTQ amounts with zero cents (should use "exacto/exactos")
      {
        value: 1.0,
        options: { currency: "GTQ" },
        expected: "un quetzal exacto",
      },
      {
        value: 7650,
        options: { currency: "GTQ" },
        expected: "siete mil seiscientos cincuenta quetzales exactos",
      },
      {
        value: 7650.0,
        options: { currency: "GTQ" },
        expected: "siete mil seiscientos cincuenta quetzales exactos",
      },
      {
        value: 3410,
        options: { currency: "GTQ" },
        expected: "tres mil cuatrocientos diez quetzales exactos",
      },
      {
        value: 3410.0,
        options: { currency: "GTQ" },
        expected: "tres mil cuatrocientos diez quetzales exactos",
      },
      {
        value: 2444,
        options: { currency: "GTQ" },
        expected: "dos mil cuatrocientos cuarenta y cuatro quetzales exactos",
      },
      {
        value: 2444.0,
        options: { currency: "GTQ" },
        expected: "dos mil cuatrocientos cuarenta y cuatro quetzales exactos",
      },
      // Test with explicit zero cents - in GTQ the "exactos" should still override
      {
        value: 7650,
        options: { currency: "GTQ", showZeroCents: true },
        expected: "siete mil seiscientos cincuenta quetzales exactos",
      },
      {
        value: 1.0,
        options: { currency: "GTQ", showZeroCents: true },
        expected: "un quetzal exacto",
      },
      // Test without cents
      {
        value: 1.5,
        options: { currency: "EUR", cents: false },
        expected: "un euro",
      },
      {
        value: 2.99,
        options: { currency: "USD", cents: false },
        expected: "dos dólares",
      },
      // Test with different separator
      {
        value: 1.5,
        options: { currency: "EUR", separator: "y" },
        expected: "un euro y cincuenta céntimos",
      },
      {
        value: 2.05,
        options: { currency: "USD", separator: "y" },
        expected: "dos dólares y cinco centavos",
      },
    ];

    test.each(testCases)(
      "convierte $value $options.currency a '$expected'",
      ({ value, options, expected }) => {
        expect(converter.toCurrency(value, options)).toBe(expected);
      }
    );

    it("lanza error para moneda no soportada", () => {
      expect(() => converter.toCurrency(1, { currency: "XXX" })).toThrow(
        "Currency XXX is not supported"
      );
    });

    it("lanza error para entrada no numérica", () => {
      expect(() => converter.toCurrency("1" as any)).toThrow(
        "Input must be a number"
      );
    });
  });
});
