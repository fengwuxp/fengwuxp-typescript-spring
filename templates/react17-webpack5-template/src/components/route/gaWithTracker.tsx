import React, {useEffect} from "react";
import {RouteProps} from "react-router";
import ReactGA from "react-ga";


let prevPage = null;

/**
 * Google Analytics
 * @param WrappedRoute
 * @param options
 */
export function withTracker<P extends RouteProps>(WrappedRoute: React.ComponentType<P>, options = {}): React.FunctionComponent<P> {
    const trackPage = (page) => {
        if (prevPage == page) {
            // 避免重复上报
            return
        }
        prevPage = page;
        ReactGA.set({
            page,
            ...options
        });
        ReactGA.pageview(page);
    };
    return (props) => {
        useEffect(() => {
            const {location: {pathname: currentPage, search: queryString}} = props;
            trackPage(`${currentPage}${queryString}`);
        }, [])
        return <WrappedRoute {...props} />;
    }
}