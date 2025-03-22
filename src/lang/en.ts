import { Num2WordBase, CurrencyData } from "../base";
import { NumWordPair, NumWordList } from "../types";
import { CurrencyOptions } from "../types";

export class Num2WordEN extends Num2WordBase {
  private ords: { [key: string]: string } = {
    one: "first",
    two: "second",
    three: "third",
    four: "fourth",
    five: "fifth",
    six: "sixth",
    seven: "seventh",
    eight: "eighth",
    nine: "ninth",
    ten: "tenth",
    eleven: "eleventh",
    twelve: "twelfth",
    twenty: "twentieth",
    thirty: "thirtieth",
    forty: "fortieth",
    fifty: "fiftieth",
    sixty: "sixtieth",
    seventy: "seventieth",
    eighty: "eightieth",
    ninety: "ninetieth",
    hundred: "hundredth",
    thousand: "thousandth",
    million: "millionth",
  };

  private CURRENCY_DATA: CurrencyData = {
    EUR: {
      singular: "euro",
      plural: "euros",
      fraction: "cent",
      fractions: "cents",
    },
    USD: {
      singular: "dollar",
      plural: "dollars",
      fraction: "cent",
      fractions: "cents",
    },
    GBP: {
      singular: "pound sterling",
      plural: "pounds sterling",
      fraction: "penny",
      fractions: "pence",
    },
    GTQ: {
      singular: "quetzal",
      plural: "quetzales",
      fraction: "cent",
      fractions: "cents",
    },
  };

  protected setup(): void {
    this.negword = "minus ";
    this.pointword = "point";
    this.excludeTitle = ["and", "point", "minus"];
    this.MAXVAL = 1000000000000;

    const midNumwords: [number, string][] = [
      [1000000, "million"],
      [1000, "thousand"],
      [100, "hundred"],
      [90, "ninety"],
      [80, "eighty"],
      [70, "seventy"],
      [60, "sixty"],
      [50, "fifty"],
      [40, "forty"],
      [30, "thirty"],
    ];

    const lowNumwords: string[] = [
      "twenty",
      "nineteen",
      "eighteen",
      "seventeen",
      "sixteen",
      "fifteen",
      "fourteen",
      "thirteen",
      "twelve",
      "eleven",
      "ten",
      "nine",
      "eight",
      "seven",
      "six",
      "five",
      "four",
      "three",
      "two",
      "one",
      "zero",
    ];

    this.setMidNumwords(midNumwords);
    this.setLowNumwords(lowNumwords);
  }

  protected merge(lpair: NumWordPair, rpair: NumWordPair): NumWordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;

    if (lnum === 1 && rnum < 100) {
      return [rtext, rnum];
    } else if (rnum > lnum) {
      if (rnum >= 100) {
        return [`${ltext} ${rtext}`, lnum * rnum];
      } else {
        return [`${ltext} ${rtext}`, lnum + rnum];
      }
    } else if (lnum >= 100 && rnum < 100) {
      return [`${ltext} and ${rtext}`, lnum + rnum];
    } else {
      return [`${ltext} ${rtext}`, lnum + rnum];
    }
  }

  protected clean(
    val: Array<NumWordPair | Array<NumWordPair | NumWordList>>
  ): NumWordPair {
    let out = val;
    while (out.length !== 1) {
      const newOut: Array<NumWordPair | Array<NumWordPair | NumWordList>> = [];
      const [left, right, ...rest] = out;

      if (!Array.isArray(left[0]) && !Array.isArray(right[0])) {
        newOut.push(this.merge(left as NumWordPair, right as NumWordPair));
        if (rest.length) {
          newOut.push(...rest);
        }
      } else {
        for (const elem of out) {
          if (Array.isArray(elem[0])) {
            if (elem.length === 1) {
              newOut.push(elem[0]);
            } else {
              newOut.push(
                this.clean(
                  elem as Array<NumWordPair | Array<NumWordPair | NumWordList>>
                )
              );
            }
          } else {
            newOut.push(elem);
          }
        }
      }
      out = newOut;
    }
    return out[0] as NumWordPair;
  }

  protected splitnum(
    value: number
  ): Array<NumWordPair | Array<NumWordPair | NumWordList>> {
    for (const elem of Array.from(this.cards.keys()).sort((a, b) => b - a)) {
      if (elem > value) continue;

      const out: Array<NumWordPair | Array<NumWordPair | NumWordList>> = [];
      let div: number, mod: number;

      if (value === 0) {
        div = 1;
        mod = 0;
      } else {
        div = Math.floor(value / elem);
        mod = value % elem;
      }

      if (div === 1) {
        out.push([this.cards.get(1) || "one", 1]);
      } else {
        if (div === value) {
          // The system tallies, eg Roman Numerals
          return [[this.cards.get(elem) || "", div * elem]];
        }
        out.push(this.splitnum(div));
      }

      out.push([this.cards.get(elem) || "", elem]);

      if (mod) {
        out.push(this.splitnum(mod));
      }

      return out;
    }

    return [[this.cards.get(value) || value.toString(), value]];
  }

  public toCardinal(value: number): string {
    if (typeof value !== "number") {
      throw new Error(this.errmsgNonnum);
    }

    let out = "";
    if (value < 0) {
      value = Math.abs(value);
      out = this.negword;
    }

    if (value >= this.MAXVAL) {
      throw new Error(this.errmsgToobig + this.MAXVAL.toString());
    }

    const val = this.splitnum(value);
    const [words] = this.clean(val);
    return this.title(out + words);
  }

  public toOrdinal(value: number): string {
    this.verify_ordinal(value);
    const outwords = this.toCardinal(value).split(" ");
    const lastwords = outwords[outwords.length - 1].split("-");
    let lastword = lastwords[lastwords.length - 1].toLowerCase();

    if (this.ords[lastword]) {
      lastword = this.ords[lastword];
    } else {
      if (lastword.endsWith("y")) {
        lastword = lastword.slice(0, -1) + "ie";
      }
      lastword += "th";
    }

    lastwords[lastwords.length - 1] = this.title(lastword);
    outwords[outwords.length - 1] = lastwords.join("-");
    return outwords.join(" ");
  }

  public toOrdinalNum(value: number): string {
    this.verify_ordinal(value);
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${value}th`;
    }

    switch (lastDigit) {
      case 1:
        return `${value}st`;
      case 2:
        return `${value}nd`;
      case 3:
        return `${value}rd`;
      default:
        return `${value}th`;
    }
  }

  public toYear(
    value: number,
    suffix: string | null = null,
    longval: boolean = true
  ): string {
    if (value < 0) {
      value = Math.abs(value);
      suffix = suffix || "BC";
    }

    const high = Math.floor(value / 100);
    const low = value % 100;
    let valtext: string;

    // If year is 00XX, X00X, or beyond 9999, go cardinal
    if (high === 0 || (high % 10 === 0 && low < 10) || high >= 100) {
      valtext = this.toCardinal(value);
    } else {
      const hightext = this.toCardinal(high);
      let lowtext: string;
      if (low === 0) {
        lowtext = "hundred";
      } else if (low < 10) {
        lowtext = `oh-${this.toCardinal(low)}`;
      } else {
        lowtext = this.toCardinal(low);
      }
      valtext = `${hightext} ${lowtext}`;
    }

    return suffix ? `${valtext} ${suffix}` : valtext;
  }

  protected setHighNumwords(high: string[]): void {
    const max = 3 + 3 * high.length;
    for (let i = 0; i < high.length; i++) {
      const word = high[i];
      const n = max - i * 3;
      this.cards.set(Math.pow(10, n), word + "illion");
    }
  }

  public toCurrency(value: number, options: CurrencyOptions = {}): string {
    const defaultOptions: Required<CurrencyOptions> = {
      currency: "EUR",
      cents: true,
      separator: "and",
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
      result = "minus ";
    }

    // Convert integer part
    const integerWords = this.toCardinal(integerPart);
    result +=
      integerWords +
      " " +
      (integerPart === 1 ? currencyData.singular : currencyData.plural);

    // Add cents if requested
    if (finalOptions.cents && (decimalPart > 0 || finalOptions.showZeroCents)) {
      const centsWords = this.toCardinal(decimalPart);
      result +=
        " " +
        finalOptions.separator +
        " " +
        centsWords +
        " " +
        (decimalPart === 1 ? currencyData.fraction : currencyData.fractions);
    }

    return result;
  }
}
