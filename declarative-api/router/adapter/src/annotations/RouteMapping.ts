/**
 *
 * @param pathname
 * @constructor
 */
export const RouterMapping = (pathname?: string) => {

    return function (target, prop) {
        target[prop] = function () {};
        target[prop].pathname = pathname;
        return target;
    }
};
