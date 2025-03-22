# Publishing to npm via GitHub Actions

This project is set up to automatically publish to npm when a new release is created on GitHub.

## Setup

To enable automated publishing, you need to:

1. **Create an npm token:**

   - Log in to your npm account at https://www.npmjs.com/
   - Go to your profile settings
   - Select "Access Tokens"
   - Create a new "Automation" token
   - Copy the token value

2. **Add the token to GitHub Secrets:**

   - In your GitHub repository, go to "Settings" -> "Secrets and variables" -> "Actions"
   - Create a new repository secret
   - Name it `NPM_TOKEN`
   - Paste the npm token value you copied
   - Click "Add secret"

3. **Create a GitHub Release:**
   - Go to the "Releases" section of your repository
   - Click "Create a new release"
   - Add a tag version (e.g., v1.0.0) - make sure it matches the version in package.json
   - Add a title and description
   - Publish the release

## Release Process

When preparing a new release, follow these steps:

1. **Update the version number:**

   ```bash
   npm version patch   # For a bug fix release
   npm version minor   # For a feature release
   npm version major   # For a breaking change release
   ```

   This will:

   - Update the version in package.json
   - Run the `version` script to update the CHANGELOG.md file
   - Commit the changes
   - Create a git tag

2. **Update the changelog:**
   The changelog is automatically updated with a template, but you need to fill in the actual changes manually.
   Edit the CHANGELOG.md file to document all the added features, changes, and fixes.

3. **Push changes and tag:**

   ```bash
   git push && git push --tags
   ```

4. **Create a GitHub Release:**
   - Go to the "Releases" section of your repository
   - Click "Create a new release"
   - Select the tag you just pushed
   - Add a title and description (you can copy from the changelog)
   - Publish the release

## How it works

When you create a new release, the GitHub Action workflow will:

1. Check out the code
2. Set up Node.js
3. Verify that the tag version matches the package.json version
4. Install dependencies
5. Run tests
6. Build the package
7. Publish to npm

## Manual publishing

You can also publish the package manually with:

```bash
npm login  # if not already logged in
npm publish
```

Remember to update the version in `package.json` and the CHANGELOG.md before publishing a new version.
