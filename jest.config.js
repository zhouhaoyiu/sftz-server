module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true },
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
};
