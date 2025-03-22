# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-03-22

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
