import * as os from 'os';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import filesize from "rollup-plugin-filesize";
import includePaths from "rollup-plugin-includepaths";
import analyze from "rollup-plugin-analyzer";
import dts from "rollup-plugin-dts";

import pkg from './package.json';
import {DEFAULT_EXTENSIONS} from "@babel/core";

const cpuNums = os.cpus().length;

const getConfig = (isProd) => {
    return {
        input: './src/index.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en#external-e-external
        external: [
            "@abraham/reflection",
            "request",
            "fengwuxp-common-proxy",
            "fengwuxp-common-utils",
            "fengwuxp-typescript-feign",
            "feign-boot-starter"
        ],
        output: [
            {
                file: isProd ? pkg.main.replace(".js", ".min.js") : pkg.main,
                format: 'commonjs',
                compact: true,
                extend: false,
                sourcemap: isProd,
                strictDeprecations: false
            },
            {
                file: isProd ? pkg.module.replace(".js", ".min.js") : pkg.module,
                format: 'esm',
                compact: true,
                extend: false,
                sourcemap: isProd,
                strictDeprecations: false
            }
        ],
        plugins: [
            typescript({
                tsconfig: "./tsconfig.lib.json",
                tsconfigOverride: {
                    compilerOptions: {
                        module: "esnext",
                        declaration: false
                    }
                }
            }),
            json(),
            resolve(),
            commonjs({
                // 包括
                include: [
                    // 'node_modules/**'
                ],
                // 排除
                exclude: [],
                extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
            }),
            babel({
                exclude: "node_modules/**",
                babelHelpers: "runtime",
                extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"]
            }),
            analyze({
                stdout: true,
            }),
            filesize(),
            includePaths({
                paths: ["./src"]
            }),
            //压缩代码
            isProd && terser({
                output: {
                    comments: false,
                    source_map: true,
                },
                keep_classnames: false,
                ie8: false,
                ecma: 2015,
                numWorkers: cpuNums
            }),

        ],
        treeshake: {
            moduleSideEffects: true
        },
    }
};


export default [
    getConfig(false),
    getConfig(true),
    {
        input: "./types-temp/index.d.ts",
        output: {
            file: "./types/index.d.ts",
            format: "es"
        },
        plugins: [dts()],
    },
]

