import * as os from 'os';
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import dts from "rollup-plugin-dts";
import filesize from "rollup-plugin-filesize";
import includePaths from "rollup-plugin-includepaths";
import analyze from "rollup-plugin-analyzer";

import pkg from './package.json';
import {DEFAULT_EXTENSIONS} from "@babel/core";

const cpuNums = os.cpus().length;

const getConfig = (isProd) => {
    return {
        input: './src/index.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en#external-e-external
        external: [
            "core-js",
            "@babel/runtime-corejs3",
            "@abraham/reflection",
            "fengwuxp-typescript-feign",
            "feign-boot-starter",
            "@tarojs/taro"
        ],
        output: [
            {
                file: isProd ? pkg.main.replace(".js", ".min.js") : pkg.main,
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
            common({
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
                    comments: false
                },
                // include: [/^.+\.js$/],
                // exclude: ['node_modules/**'],
                numWorkers: cpuNums,
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

