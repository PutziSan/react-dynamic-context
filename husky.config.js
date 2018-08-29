module.exports = {
  hooks: {
    // pre-commit hook to run prettier on git-changed files
    // pretty-quick https://github.com/azz/pretty-quick
    'pre-commit': 'lint-staged --config dev/.lintstagedrc'
  }
};
