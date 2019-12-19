import * as os from 'os';
import * as  path from "path";
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
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
            "reflect-metadata",
            "request",
            "fengwuxp-common-proxy",
            "fengwuxp-common-utils",
            "fengwuxp-typescript-feign",
            "feign-boot-stater"
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
            json(),
            typescript({
                tsconfig: "./tsconfig.lib.json",
                tsconfigOverride: {
                    compilerOptions: {
                        module: "esnext",
                        declaration: false
                    }
                }
            }),
            resolve(),
            common({
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
            //压缩代码
            isProd && terser({
                output: {
                    comments: false
                },
                include: [/^.+\.js$/],
                exclude: ['node_moudles/**'],
                numWorkers: cpuNums,
                sourcemap: false
            })
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

