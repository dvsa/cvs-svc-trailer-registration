// https://github.com/conventional-changelog/commitlint/blob/master/@commitlint/config-conventional/index.js
// https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'type-case': [2, 'always', 'upper-case'],
    'type-enum': [2, 'always', ['REVERT', 'FEAT', 'TEST', 'FIX', 'CHORE', 'CI', 'DOCS', 'BREAKING_CHANGE', 'REFACTOR']],
    'subject-case': [2, 'always', 'lower-case'],
    // level: disabled to use our own rule with commitlint-plugin-function-rules plugin
    'scope-case': [0],
    'function-rules/scope-empty': [
      2,
      'always',
      (parsed) => {
        // type(scope?): subject
        if ((parsed?.scope && parsed.scope.match(/^CVSB-\d+$/) !== null) || parsed.scope === 'RELEASE') {
          return [true];
        } else {
          return [false, `scope must have the following format: (CVSB-XXXX) where 'XXXX' is a ticket number`];
        }
      },
    ],
  },
};
