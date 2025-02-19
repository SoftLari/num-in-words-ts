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
import { Num2WordEN } from "num-in-words-ts";

const converter = new Num2WordEN();

console.log(converter.toCardinal(1234)); // "one thousand two hundred and thirty four"
console.log(converter.toOrdinal(1234)); // "one thousand two hundred and thirty fourth"
console.log(converter.toOrdinalNum(1234)); // "1234th"
```

## Features

- Convert numbers to words in multiple languages
- Support for negative numbers
- Support for ordinal numbers (both in words and numerals)
- Extensible architecture for adding new languages
- Written in TypeScript with full type safety
- Zero dependencies
- Comprehensive test coverage

## Supported Languages

Currently supported languages:

- English (EN)
- More languages coming soon...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Adding a New Language

To add support for a new language:

1. Create a new file in `src/lang/` for your language (e.g., `fr.ts` for French)
2. Extend the `Num2WordBase` class and implement the required methods
3. Add tests for your implementation
4. Export the new language class from `src/index.ts`

## License

This project is licensed under the LGPL-2.1 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project is a TypeScript port of the Python [num2words](https://github.com/savoirfairelinux/num2words) library.
