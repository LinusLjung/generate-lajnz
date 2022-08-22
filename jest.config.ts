import { InitialOptionsTsJest } from 'ts-jest';

const ignorePatterns = ['/node_modules/', '/dist/'];

const config: InitialOptionsTsJest = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '/dist/'],
  coverageProvider: 'v8',
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  watchPathIgnorePatterns: ignorePatterns,
  setupFilesAfterEnv: ['jest-extended/all'],
};

export default config;
