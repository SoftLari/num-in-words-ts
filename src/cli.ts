#!/usr/bin/env node
import { Command } from "commander";
import { Num2WordBase } from "./base";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import language converters
import { Num2WordEN } from "./lang/en";
import { Num2WordES } from "./lang/es";

// Get package version from package.json
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
);
const version = packageJson.version;

// Create a language map
const languages: { [key: string]: new () => Num2WordBase } = {
  en: Num2WordEN,
  es: Num2WordES,
};

// Create a converter factory
function createConverter(lang = "en"): Num2WordBase {
  const Constructor = languages[lang.toLowerCase()];
  if (!Constructor) {
    throw new Error(
      `Unsupported language: ${lang}. Available languages: ${Object.keys(
        languages
      ).join(", ")}`
    );
  }
  return new Constructor();
}

const program = new Command();

program
  .name("num-in-words")
  .description("Convert numbers to words in multiple languages")
  .version(version)
  .option("-l, --language <code>", 'Language code (default: "en")', "en")
  .option("-o, --ordinal", "Convert to ordinal words", false)
  .option("-n, --ordinal-num", "Convert to ordinal number", false)
  .option("-c, --currency <code>", "Convert to currency (e.g., EUR, USD, GTQ)")
  .option(
    "-s, --separator <word>",
    "Word to separate whole and decimal parts (default depends on language)"
  )
  .option("--no-cents", "Do not include cents/decimals in currency conversion")
  .option("--show-zero-cents", "Show zero cents in currency conversion")
  .argument("<number>", "Number to convert", parseFloat)
  .action((number, options) => {
    try {
      const converter = createConverter(options.language);

      let result: string;
      if (options.ordinalNum) {
        result = converter.toOrdinalNum(number);
      } else if (options.ordinal) {
        result = converter.toOrdinal(number);
      } else if (options.currency) {
        // Currency conversion with options
        const currencyOptions = {
          currency: options.currency,
          cents: options.cents !== false,
          separator: options.separator,
          showZeroCents: options.showZeroCents || false,
        };
        result = converter.toCurrency(number, currencyOptions);
      } else {
        result = converter.toCardinal(number);
      }

      console.log(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    }
  });

// Parse command line arguments
program.parse();
