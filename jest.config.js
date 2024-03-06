module.exports = {
  coverageReporters: ['lcov', 'json', 'html'],
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    'apps/**/*.{ts,tsx}',
    '!**/index.tsx',
    '!**/reportWebVitals.ts',
    '!setupTests.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/{tests,__tests__}/**',
  ],
  transformIgnorePatterns: ['/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$'],
  testEnvironment: 'jsdom',
  setupFiles: ['./setupTests'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^nero/(.*)$': '<rootDir>/node_modules/@nero/$1/dist/index.js',
  },
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
};
