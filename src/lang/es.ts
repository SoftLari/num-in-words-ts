import { Num2WordBase, CurrencyData } from "../base";
import { NumWordPair, NumWordList } from "../types";
import { CurrencyOptions } from "../types";

export class Num2WordES extends Num2WordBase {
  private CARDINAL_WORDS: { [key: number]: string } = {};
  private ORDINAL_WORDS: { [key: number]: string } = {};
  private HUNDREDS: string[] = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];
  private ORDINAL_HUNDREDS: string[] = [
    "",
    "centésimo",
    "ducentésimo",
    "tricentésimo",
    "cuadringentésimo",
    "quingentésimo",
    "sexcentésimo",
    "septingentésimo",
    "octingentésimo",
    "noningentésimo",
  ];

  private CURRENCY_DATA: CurrencyData = {
    EUR: {
      singular: "euro",
      plural: "euros",
      fraction: "céntimo",
      fractions: "céntimos",
    },
    USD: {
      singular: "dólar",
      plural: "dólares",
      fraction: "centavo",
      fractions: "centavos",
    },
    GBP: {
      singular: "libra esterlina",
      plural: "libras esterlinas",
      fraction: "penique",
      fractions: "peniques",
    },
    MXN: {
      singular: "peso mexicano",
      plural: "pesos mexicanos",
      fraction: "centavo",
      fractions: "centavos",
    },
    COP: {
      singular: "peso colombiano",
      plural: "pesos colombianos",
      fraction: "centavo",
      fractions: "centavos",
    },
    ARS: {
      singular: "peso argentino",
      plural: "pesos argentinos",
      fraction: "centavo",
      fractions: "centavos",
    },
    GTQ: {
      singular: "quetzal",
      plural: "quetzales",
      fraction: "centavo",
      fractions: "centavos",
    },
  };

  constructor() {
    super();
    this.setup();
  }

  protected setup(): void {
    this.CARDINAL_WORDS = {
      0: "cero",
      1: "uno",
      2: "dos",
      3: "tres",
      4: "cuatro",
      5: "cinco",
      6: "seis",
      7: "siete",
      8: "ocho",
      9: "nueve",
      10: "diez",
      11: "once",
      12: "doce",
      13: "trece",
      14: "catorce",
      15: "quince",
      16: "dieciséis",
      17: "diecisiete",
      18: "dieciocho",
      19: "diecinueve",
      20: "veinte",
      21: "veintiuno",
      22: "veintidós",
      23: "veintitrés",
      24: "veinticuatro",
      25: "veinticinco",
      26: "veintiséis",
      27: "veintisiete",
      28: "veintiocho",
      29: "veintinueve",
      30: "treinta",
      40: "cuarenta",
      50: "cincuenta",
      60: "sesenta",
      70: "setenta",
      80: "ochenta",
      90: "noventa",
      100: "cien",
      1000: "mil",
      1000000: "millon",
    };

    this.ORDINAL_WORDS = {
      1: "primero",
      2: "segundo",
      3: "tercero",
      4: "cuarto",
      5: "quinto",
      6: "sexto",
      7: "séptimo",
      8: "octavo",
      9: "noveno",
      10: "décimo",
      11: "undécimo",
      12: "duodécimo",
      13: "decimotercero",
      14: "decimocuarto",
      15: "decimoquinto",
      16: "decimosexto",
      17: "decimoséptimo",
      18: "decimoctavo",
      19: "decimonoveno",
      20: "vigésimo",
      30: "trigésimo",
      40: "cuadragésimo",
      50: "quincuagésimo",
      60: "sexagésimo",
      70: "septuagésimo",
      80: "octogésimo",
      90: "nonagésimo",
      100: "centésimo",
      1000: "milésimo",
    };
  }

  protected setHighNumwords(high: string[]): void {
    const max = 3 + 3 * high.length;
    for (let i = 0; i < high.length; i++) {
      const word = high[i];
      const n = max - i * 3;
      this.cards.set(Math.pow(10, n), word + "illón");
    }
  }

  protected merge(curr: NumWordPair, next: NumWordPair): NumWordPair {
    const [ltext, lnum] = curr;
    const [rtext, rnum] = next;

    if (lnum === 1 && rnum <= 1000000) {
      return [`un ${rtext}`, rnum];
    }

    if (rnum > 1000000) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    }

    if (rnum > 1000) {
      if (lnum === 1) {
        return [rtext, rnum];
      }
      return [`${ltext} ${rtext}`, lnum + rnum];
    }

    if (rnum > 100) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    }

    if (rnum > 0) {
      if (rnum < 30) {
        return [`${ltext} ${rtext}`, lnum + rnum];
      }
      return [`${ltext} y ${rtext}`, lnum + rnum];
    }

    return [ltext, lnum];
  }

  protected clean(wordList: NumWordPair[]): NumWordPair {
    let words: string[] = [];
    let total = 0;

    for (const [text, num] of wordList) {
      words.push(text);
      total += num;
    }

    return [words.join(" "), total];
  }

  protected splitnum(value: number): NumWordPair[] {
    if (value < 100) {
      if (this.CARDINAL_WORDS[value]) {
        return [[this.CARDINAL_WORDS[value], value]];
      }
      const tens = Math.floor(value / 10) * 10;
      const ones = value % 10;
      return [
        [`${this.CARDINAL_WORDS[tens]} y ${this.CARDINAL_WORDS[ones]}`, value],
      ];
    }

    if (value < 1000) {
      const hundreds = Math.floor(value / 100);
      const remainder = value % 100;
      if (remainder === 0) {
        if (hundreds === 1) {
          return [[this.CARDINAL_WORDS[100], 100]];
        }
        return [[this.HUNDREDS[hundreds], value]];
      }
      if (hundreds === 1) {
        return [
          [this.HUNDREDS[hundreds], hundreds * 100],
          ...this.splitnum(remainder),
        ];
      }
      return [
        [this.HUNDREDS[hundreds], hundreds * 100],
        ...this.splitnum(remainder),
      ];
    }

    if (value < 1000000) {
      const thousands = Math.floor(value / 1000);
      const remainder = value % 1000;
      if (remainder === 0) {
        if (thousands === 1) {
          return [[this.CARDINAL_WORDS[1000], 1000]];
        }
        return [
          [`${this.toCardinal(thousands)} ${this.CARDINAL_WORDS[1000]}`, value],
        ];
      }
      if (thousands === 1) {
        return [[this.CARDINAL_WORDS[1000], 1000], ...this.splitnum(remainder)];
      }
      return [
        [
          `${this.toCardinal(thousands)} ${this.CARDINAL_WORDS[1000]}`,
          thousands * 1000,
        ],
        ...this.splitnum(remainder),
      ];
    }

    const millions = Math.floor(value / 1000000);
    const remainder = value % 1000000;
    if (remainder === 0) {
      if (millions === 1) {
        return [[`un ${this.CARDINAL_WORDS[1000000]}`, 1000000]];
      }
      return [
        [
          `${this.toCardinal(millions)} ${this.CARDINAL_WORDS[1000000]}es`,
          value,
        ],
      ];
    }
    if (millions === 1) {
      return [
        [`un ${this.CARDINAL_WORDS[1000000]}`, 1000000],
        ...this.splitnum(remainder),
      ];
    }
    return [
      [
        `${this.toCardinal(millions)} ${this.CARDINAL_WORDS[1000000]}es`,
        millions * 1000000,
      ],
      ...this.splitnum(remainder),
    ];
  }

  public toCardinal(value: number): string {
    if (typeof value !== "number") {
      throw new Error("Input must be a number");
    }

    if (value < 0) {
      return `menos ${this.toCardinal(Math.abs(value))}`;
    }

    if (value === 0) {
      return this.CARDINAL_WORDS[0];
    }

    const [text] = this.clean(this.splitnum(value));
    return text;
  }

  public toOrdinal(value: number): string {
    if (value <= 0) return "";

    if (this.ORDINAL_WORDS[value]) {
      return this.ORDINAL_WORDS[value];
    }

    if (value < 100) {
      const tens = Math.floor(value / 10) * 10;
      const ones = value % 10;
      if (ones === 0) {
        return this.ORDINAL_WORDS[tens];
      }
      return `${this.ORDINAL_WORDS[tens]} ${this.ORDINAL_WORDS[ones]}`;
    }

    if (value < 1000) {
      const hundreds = Math.floor(value / 100);
      const remainder = value % 100;
      if (remainder === 0) {
        return this.ORDINAL_HUNDREDS[hundreds];
      }
      return `${this.ORDINAL_HUNDREDS[hundreds]} ${this.toOrdinal(remainder)}`;
    }

    return this.ORDINAL_WORDS[1000];
  }

  public toOrdinalNum(value: number): string {
    return `${value}º`;
  }

  public toCurrency(value: number, options: CurrencyOptions = {}): string {
    const defaultOptions: Required<CurrencyOptions> = {
      currency: "EUR",
      cents: true,
      separator: "con",
      showZeroCents: false,
    };

    const finalOptions = { ...defaultOptions, ...options };

    if (typeof value !== "number") {
      throw new Error("Input must be a number");
    }

    const currencyData = this.CURRENCY_DATA[finalOptions.currency];
    if (!currencyData) {
      throw new Error(`Currency ${finalOptions.currency} is not supported`);
    }

    const integerPart = Math.floor(Math.abs(value));
    const decimalPart = Math.round((Math.abs(value) - integerPart) * 100);

    let result = "";

    // Handle negative values
    if (value < 0) {
      result = "menos ";
    }

    // Convert integer part
    let integerWords = this.toCardinal(integerPart);

    // Use "un" instead of "uno" for currency values
    if (integerPart === 1) {
      integerWords = "un";
    }

    result +=
      integerWords +
      " " +
      (integerPart === 1 ? currencyData.singular : currencyData.plural);

    // Special case for GTQ with zero cents
    if (finalOptions.currency === "GTQ" && decimalPart === 0) {
      return result + (integerPart === 1 ? " exacto" : " exactos");
    }

    // Add cents if requested
    if (finalOptions.cents && (decimalPart > 0 || finalOptions.showZeroCents)) {
      const centsWords = this.toCardinal(decimalPart);
      result +=
        " " +
        (finalOptions.separator || "con") +
        " " +
        centsWords +
        " " +
        (decimalPart === 1 ? currencyData.fraction : currencyData.fractions);
    }

    return result;
  }
}
