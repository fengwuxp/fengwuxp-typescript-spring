import {InterceptorRegistration} from "./InterceptorRegistration";

/**
 * interceptor registry
 * {@link InterceptorRegistration}
 */
export interface InterceptorRegistry {

    addInterceptor: (interceptor) => InterceptorRegistration;

    getInterceptors: () => any[];
}

export const getInterceptors = (interceptorRegistrations: InterceptorRegistration[]) => {
    return interceptorRegistrations.map(item => item.getInterceptor());
};
