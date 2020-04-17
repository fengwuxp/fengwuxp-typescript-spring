import { InterceptorRegistration } from "./InterceptorRegistration";
export interface InterceptorRegistry {
    addInterceptor: (interceptor: any) => InterceptorRegistration;
    getInterceptors: () => any[];
}
export declare const getInterceptors: (interceptorRegistrations: InterceptorRegistration[]) => any[];
