const fs = require("fs");

module.exports = {
    rootDir: fs.realpathSync(process.cwd()),
    preset: "ts-jest",
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.ts[x]?$': 'ts-jest',
    },
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
    moduleNameMapper: {
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
            // babelConfig: true,
            babelConfig: 'babel.config.js'
        },
    },
};
