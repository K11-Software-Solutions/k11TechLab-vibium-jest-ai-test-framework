module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['default', '<rootDir>/scripts/jest-root-report.cjs'],
  testMatch: [
    '**/__tests__/**/*.?([mc])[jt]s?(x)',
    '**/?(*.)+(spec|test).?([mc])[jt]s?(x)',
    '<rootDir>/src/k11-platform/tests/lighthouse/**/*.js',
  ],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
