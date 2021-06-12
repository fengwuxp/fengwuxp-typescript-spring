import React from "react";
import {Action, createBrowserHistory, Location} from "history";
import {BrowserRouter} from "react-router-dom";
import {routes} from "@/views/routes";
import {renderAppRoutes} from "@/ReanderRoutes";


const history = createBrowserHistory({
    basename: "/"
});

history.listen((location: Location, action: Action) => {
    console.log("路由变化", location.pathname, action);
})

const App = (pops) => {

    return <BrowserRouter basename={"/"}>
        {
            renderAppRoutes(routes, {
                authorization: (args): Promise<any> => {
                    return Promise.resolve({
                        username: "张三"
                    });
                },
                isAuthenticated: (): Promise<boolean> => {
                    return Promise.resolve(true);
                }
            })
        }
    </BrowserRouter>
}

export default App;
