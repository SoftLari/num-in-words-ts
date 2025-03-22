# Changes

## Migration from GitHub Packages to npm Registry

The package distribution method has been updated from GitHub Packages to the npm public registry.

### Changes made:

1. **Package.json updates**:

   - Removed `@softlari/` scope from package name
   - Removed the `publishConfig` section that was pointing to GitHub Packages

2. **GitHub Actions workflow**:

   - Updated to publish to npm instead of GitHub Packages
   - Changed registry URL to `https://registry.npmjs.org`
   - Changed token reference from `GITHUB_TOKEN` to `NPM_TOKEN`
   - Added `--access=public` flag to the npm publish command

3. **Added .npmignore**:

   - Created to control which files are included in the published package
   - Excluded test files, config files, and development-related files

4. **Documentation**:
   - Added `docs/npm-publishing.md` with instructions for setting up automated publishing
   - Updated README with information about npm publishing

### Using the new package:

The package can now be installed directly from npm:

```bash
npm install num-in-words-ts
```

### For maintainers:

To set up automated publishing to npm:

1. Create an npm token with publish permissions
2. Add the token to your GitHub repository secrets as `NPM_TOKEN`
3. Create a new GitHub release to trigger the publishing workflow

See `docs/npm-publishing.md` for more detailed instructions.
