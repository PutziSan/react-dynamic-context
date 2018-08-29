const path = require('path');

module.exports = {
  // make sure to install an enzyme-adapter: https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-environment-enzyme#readme
  setupTestFrameworkScriptFile: path.join(__dirname, 'dev', 'setupTests.js'),
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/dev/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  // FIXES:
  testURL: 'http://localhost/' // see https://github.com/jsdom/jsdom/issues/2304
};
