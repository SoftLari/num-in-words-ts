import { CurrencyOptions } from "./types";

export interface CurrencyData {
  [key: string]: {
    singular: string;
    plural: string;
    [key: string]: string;
  };
}

type NumWordPair = [string, number];
type NumWordList = NumWordPair | Array<NumWordPair | NumWordList>;

export abstract class Num2WordBase {
  protected isTitle: boolean = false;
  protected precision: number = 2;
  protected excludeTitle: string[] = [];
  protected negword: string = "(-) ";
  protected pointword: string = "(.)";
  protected cards: Map<number, string> = new Map();
  protected MAXVAL: number = 0;

  protected errmsgNonnum: string = "Input must be a number";
  protected errmsgFloatord: string = "Cannot treat float as ordinal.";
  protected errmsgNegord: string = "Cannot treat negative number as ordinal.";
  protected errmsgToobig: string = "Absolute value must be less than ";

  constructor() {
    this.setup();
    this.setNumwords();
  }

  protected abstract setup(): void;
  protected abstract setHighNumwords(high: string[]): void;

  protected setNumwords(): void {
    if (this.hasOwnProperty("highNumwords")) {
      this.setHighNumwords((this as any).highNumwords);
    }
    if (this.hasOwnProperty("midNumwords")) {
      this.setMidNumwords((this as any).midNumwords);
    }
    if (this.hasOwnProperty("lowNumwords")) {
      this.setLowNumwords((this as any).lowNumwords);
    }
  }

  protected setMidNumwords(mid: [number, string][]): void {
    for (const [key, val] of mid) {
      this.cards.set(key, val);
    }
  }

  protected setLowNumwords(numwords: string[]): void {
    for (let i = 0; i < numwords.length; i++) {
      this.cards.set(numwords.length - 1 - i, numwords[i]);
    }
  }

  protected splitnum(value: number): Array<NumWordList> {
    for (const elem of Array.from(this.cards.keys()).sort((a, b) => b - a)) {
      if (elem > value) continue;

      const out: Array<NumWordList> = [];
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

  protected parseMinus(numStr: string): [string, string] {
    if (numStr.startsWith("-")) {
      return [this.negword, numStr.slice(1)];
    }
    return ["", numStr];
  }

  protected clean(val: Array<NumWordList>): NumWordPair {
    let out = val;
    while (out.length !== 1) {
      const newOut: Array<NumWordList> = [];
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
              newOut.push(this.clean(elem as Array<NumWordList>));
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

  protected merge(lpair: NumWordPair, rpair: NumWordPair): NumWordPair {
    return [`${lpair[0]} ${rpair[0]}`, lpair[1] + rpair[1]];
  }

  protected title(text: string): string {
    if (!this.isTitle) return text;

    const words = text.split(" ");
    const titleWords = words.map((word, i) => {
      if (this.excludeTitle.includes(word.toLowerCase()) && i > 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return titleWords.join(" ");
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
    return this.toCardinal(value);
  }

  public toOrdinalNum(value: number): string {
    return value.toString();
  }

  protected verify_ordinal(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error(this.errmsgFloatord);
    }
    if (value < 0) {
      throw new Error(this.errmsgNegord);
    }
  }

  public abstract toCurrency(value: number, options?: CurrencyOptions): string;

  protected pluralize(n: number, forms: string[]): string {
    return n === 1 ? forms[0] : forms[1];
  }
}
