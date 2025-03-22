# num-in-words-ts

A TypeScript library for converting numbers into words in multiple languages. This is a TypeScript port of the Python [num2words](https://github.com/savoirfairelinux/num2words) library.

## Installation

```bash
npm install num-in-words-ts
```

## Usage

### Basic Usage

```typescript
import { toWords, toOrdinal, toOrdinalNum } from "num-in-words-ts";

// Convert numbers to words
console.log(toWords(42)); // "forty two"
console.log(toWords(1234)); // "one thousand two hundred and thirty four"
console.log(toWords(-1234)); // "minus one thousand two hundred and thirty four"

// Convert to ordinal words
console.log(toOrdinal(42)); // "forty second"
console.log(toOrdinal(1234)); // "one thousand two hundred and thirty fourth"

// Convert to ordinal numbers
console.log(toOrdinalNum(42)); // "42nd"
console.log(toOrdinalNum(1234)); // "1234th"
```

### Using Specific Language Converters

```typescript
import { Num2WordEN, Num2WordES } from "num-in-words-ts";

// English
const enConverter = new Num2WordEN();
console.log(enConverter.toCardinal(1234)); // "one thousand two hundred and thirty four"

// Spanish
const esConverter = new Num2WordES();
console.log(esConverter.toCardinal(1234)); // "mil doscientos treinta y cuatro"
```

### Using the CLI

After installing the package, you can use the CLI to convert numbers to words:

```bash
# Basic usage - defaults to cardinal words in English
npx num-in-words 1234
# one thousand two hundred and thirty four

# Specify a language
npx num-in-words 1234 --language es
# mil doscientos treinta y cuatro

# Convert to ordinal words
npx num-in-words 42 --ordinal
# forty second

# Convert to ordinal numbers
npx num-in-words 42 --ordinal-num
# 42nd

# Help
npx num-in-words --help
```

## Features

- Convert numbers to words in multiple languages
- Support for negative numbers
- Support for ordinal numbers (both in words and numerals)
- Extensible architecture for adding new languages
- Written in TypeScript with full type safety
- Zero dependencies
- Comprehensive test coverage
- CLI support

## Supported Languages

Currently supported languages:

- English (EN)
- Spanish (ES)
- More languages coming soon...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Publishing

This package is published to npm. For more information about the automated publishing process via GitHub Actions, see [npm-publishing.md](docs/npm-publishing.md).

### Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on version history and recent changes.

### Adding a New Language

To add support for a new language:

1. Create a new file in `src/lang/` for your language (e.g., `fr.ts` for French)
2. Extend the `Num2WordBase` class and implement the required methods
3. Add tests for your implementation
4. Export the new language class from `src/index.ts`
5. Add the language to the CLI language map in `src/cli.ts`

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project is a TypeScript port of the Python [num2words](https://github.com/savoirfairelinux/num2words) library.
