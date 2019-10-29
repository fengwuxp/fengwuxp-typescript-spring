import * as os from 'os';
import {RollupOptions} from "rollup";
import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2'

const cpuNums = os.cpus().length;

const IS_PROD = 'production' === process.env.NODE_ENV;
const IS_DEV = 'development' === process.env.NODE_ENV;

/**
 * 获取rollup 配置
 * @param options
 */
export const generateRollupConfig = (options: RollupOptions): RollupOptions => {

    return {
        input: options.input,
        external: options.external,
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "exnext",
                        declaration: true
                    }
                }
            }),
            resolve(),
            common({
                // 包括
                include: 'node_modules/**',
                // 排除
                exclude: [],
                extensions: ['.js', '.ts']
            }),
            babel({
                runtimeHelpers: true,
                extensions: ['.js', '.ts']
            }),
            //压缩代码
            IS_PROD ? terser({
                output: {
                    comments: false
                },
                include: [/^.+\.js$/],
                exclude: ['node_moudles/**'],
                numWorkers: cpuNums,
                sourcemap: false
            }) : null
        ],
        output: options.output,
        treeshake: {
            moduleSideEffects: true
        },
    }
};
