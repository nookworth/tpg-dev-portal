# Installation

### These steps assume you are using yarn

1. Clone the repo
2. Delete your `.npmrc` file (don't worry, this will be generated again automatically by npm the next time you run `yarn`)
   - This is usually a hidden file in the `~/` directory on Mac
3. Delete `package-lock.json`
4. Run `yarn`

# Use

### To start: run `yarn start` from the directory where you installed the repo
    - I will eventually package the app for Mac so you can run it directly from an executable file
### You will need your phone in order to sign into Okta and GitHub
### After you have signed into Okta, you can use the `AWS --->` and `AWS <---` buttons
    - Make sure the Okta signin has completed before you progress to the next step. After that, you don't need to     wait for anything.


# Contributing

Clone the repo. Submit PRs to address known issues or create new features/improvements.

# Rules

1. Don't remove comments unless you are the author, an admin, or unless you have addressed the related TODO. Comments will be used to keep track of TODOs and document code.

# Issues

### Bugs
- Fix GitHub windows positioning on MacOS
- Fix hardcoded travelpass.com URLs when checking `master`, `stg`, and `prod`

### Improvements
- Add `yarn` script for packaging
- Post generated #eng-frontend-reviews message directly to Slack (instead of copying to clipboard?)
- Code cleanup
- General styling improvements
