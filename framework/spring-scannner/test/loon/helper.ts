// const test = require("ava");
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApplicationLoader, SettingOptions, Klass} from 'loon';

// declare module 'axios' {
//     import {AxiosResponse} from "axios";
//
//     interface AxiosInstance {
//         options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
//     }
// }

const settings: SettingOptions = {port: '0'};
// @ts-ignore
let KlassApplication: Klass<ApplicationLoader>;

export const helper = {
    getAxios: () => axios as AxiosInstance,
    isExpress: () => process.env.SERVER === 'express',
    isFastify: () => process.env.SERVER === 'fastify',
    setBootOptions: (opts: { lazyInit: boolean }) => {
        settings.lazyInit = opts.lazyInit;
    },
    // @ts-ignore
    setCustomApplication: (customApplication: Klass<ApplicationLoader>) => {
        KlassApplication = customApplication;
    }
};
export const queryPage = (req?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<string>> => {
    const headers: Record<string, any> = {};
    headers['Content-Type'] = 'application/json';
    return axios.request<string>({
        url: `/order/queryPage`,
        method: 'post',
        headers,
        data: req || {},
        responseType: 'json',
        ...(options || {} as AxiosRequestConfig)
    })
}

// let nodeServer;
//
// test.before(async t => {
//
//     const app = KlassApplication ? new KlassApplication(process.env.SERVER || '', settings) : new ApplicationLoader(process.env.SERVER || '', settings);
//     (t.context as any).app = app;
//
//     nodeServer = await app.start();
//     helper.getAxios = () => {
//         return axios.create({
//             baseURL: `http://localhost:${nodeServer.address().port}`
//         });
//     };
// });
//
// test.after.always(t => {
//     return new Promise((resolve, reject) => {
//         if (!nodeServer) {
//             reject('no running server');
//             return;
//         }
//         nodeServer.close((err) => {
//             if (err) reject(err);
//             resolve();
//         });
//     });
// });
