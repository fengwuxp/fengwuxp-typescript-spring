export const AUTHENTICATION_VIEWS: string[] = [];

/**
 *
 * @param pathname
 * @param needAuthentication 是否需要登录 default:true
 * @constructor
 */
export const RouteMapping = (pathname?: string, needAuthentication: boolean = true) => {

    return function (target, prop) {
        target[prop] = function () {
        };
        target[prop].pathname = pathname;
        target[prop].needAuthentication = needAuthentication;
        if (needAuthentication) {
            AUTHENTICATION_VIEWS.push(prop);
        }
        return target;
    }
};
