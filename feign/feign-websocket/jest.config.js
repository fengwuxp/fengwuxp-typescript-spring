module.exports = {
    transform: {
        '^.+\\.ts[x]?$': 'ts-jest',
    },
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
    testPathIgnorePatterns: ["/lib/"],
    transformIgnorePatterns: [],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: false,
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.test.json',
        },
    },
};
