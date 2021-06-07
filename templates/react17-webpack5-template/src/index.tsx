import  React from "react";
import * as ReactDOM from "react-dom";
import App from "@/App";
import {Spin} from "antd";
import {setDefaultLoadingComponent} from "@/componetns/loading/AsyncLoading";

setDefaultLoadingComponent(Spin)

// Render the top-level React component
ReactDOM.render(
  <App/>,
  document.getElementById("app")
);
