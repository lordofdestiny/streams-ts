/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    transform: {
        '^.+\\.{ts|tsx}?$': ['ts-jest', {
            babel: true,
            tsConfig: 'tsconfig.spec.json',
        }],
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '~/(.*)': [
            '<rootDir>src/$1',
        ],
    },
    collectCoverage: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
}
