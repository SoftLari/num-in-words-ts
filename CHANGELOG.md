# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-03-22

### Fixed

- NPM install on CI

## [1.0.3] - 2025-03-22

### Added

- Support for currency conversion in CLI with new options:
  - `-c, --currency <code>` for currency specification (e.g., EUR, USD, GTQ)
  - `-s, --separator <word>` for custom separators between whole and decimal parts
  - `--no-cents` flag to exclude cents from output
  - `--show-zero-cents` flag to display zero cents
- Special handling for Guatemalan Quetzal (GTQ) currency:
  - For zero cents: "exacto" (singular) or "exactos" (plural) suffix
  - E.g., "veintinueve quetzales exactos" for 29.00 GTQ
- Comprehensive tests for large numbers and currency conversion with decimals

### Fixed

- Improved handling of large numbers in Spanish (>100,000)
- Fixed grammar for singular currency forms in Spanish (e.g., "un quetzal" instead of "uno quetzal")
- Correct handling of decimal values in all currencies
- Converted test framework from Jest to Vitest

## [1.0.0] - 2024-03-22

### Added

- Initial release of num-in-words-ts
- Support for converting numbers to words in English and Spanish
- Cardinal number conversion (e.g., "forty-two")
- Ordinal number conversion (e.g., "forty-second")
- Ordinal numeral conversion (e.g., "42nd")
- Command-line interface (CLI) for easy conversion
- Module builds for ESM, CommonJS, and UMD formats
- Comprehensive test coverage for all supported languages
- Documentation for library usage and extension

### Changed

- Migrated from GitHub Packages to npm public registry
- Updated build system to use Vite for multiple output formats

### Fixed

- Module resolution in ESM environments by properly using .js extensions in imports
