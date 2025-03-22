#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Read the package.json file
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, "package.json"), "utf8")
);
const newVersion = packageJson.version;

// Read the current changelog
const changelogPath = path.join(rootDir, "CHANGELOG.md");
let changelog = fs.readFileSync(changelogPath, "utf8");

// Check if this version is already in the changelog
if (changelog.includes(`## [${newVersion}]`)) {
  console.log(`Version ${newVersion} is already in the changelog`);
  process.exit(0);
}

// Get the current date
const today = new Date();
const date = today.toISOString().split("T")[0]; // YYYY-MM-DD format

// Create a new changelog entry template
const newEntry = `## [${newVersion}] - ${date}

### Added
- 

### Changed
- 

### Fixed
- 

`;

// Find the position to insert the new entry (after the header)
const headerEnd = changelog.indexOf("## [");
if (headerEnd === -1) {
  console.error("Could not find the position to insert the new entry");
  process.exit(1);
}

// Insert the new entry
const updatedChangelog =
  changelog.slice(0, headerEnd) + newEntry + changelog.slice(headerEnd);

// Write the updated changelog
fs.writeFileSync(changelogPath, updatedChangelog);

console.log(`Added entry for version ${newVersion} to CHANGELOG.md`);
console.log(
  "Please update the changelog with the actual changes for this version"
);
