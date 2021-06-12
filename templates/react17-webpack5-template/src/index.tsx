import React from "react";
import * as ReactDOM from "react-dom";
import App from "@/App";
import {Spin} from "antd";
import {setDefaultLoadingComponent} from "@/components/loading/AsyncLoading";
import {I18nextProvider} from 'react-i18next';
import i18n from '@/i18n';

setDefaultLoadingComponent(Spin)

// Render the top-level React component
ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <App/>
    </I18nextProvider>,
    document.getElementById("app")
);
