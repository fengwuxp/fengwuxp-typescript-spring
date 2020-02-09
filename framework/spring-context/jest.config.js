const fs = require("fs");

module.exports = {
    rootDir: fs.realpathSync(process.cwd()),
    transform: {
        "^.+\\.js$": require("../../ts-jest-config/babelTransform"),
        '^.+\\.ts[x]?$': 'ts-jest',
    },
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
    moduleNameMapper:{
        "^@/(.*)": "<rootDir>/src/$1",
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/(?!(fengwuxp-spring-*))'
    ],
    transformIgnorePatterns: [],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: false,
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.test.json',
        },
    },
};
