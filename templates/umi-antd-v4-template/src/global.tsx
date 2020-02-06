import './RegisterBrowserOpenFeign';
import {Button, message, notification} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import React from 'react';
import {formatMessage} from 'umi-plugin-react/locale';
import {RouteContextHolder, RouteView, ViewShowMode} from 'fengwuxp-routing-core';
import {AntdPageHeaderEnhancer, AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import defaultSettings from '../config/defaultSettings';
import AppRouter from '@/AppRouter';
import {AntdRouteContext} from '@/AntdRouteContext';
import {getLoginUser} from "@/SessionManager";
import {ApplicationEventType, CmdDataProvider} from 'fengwuxp-event-state';
import {USER_IS_LOGIN_CONDITION} from "@/constant/RouteCondition";
import {ReactCmdDataProviderEnhancer} from "fengwuxp-routing-react/src";

console.log("--process-->",
  process.env,
  process.env.UMI_ENV,
  process.env.API_ADDRESS,
);
RouteView.addEnhancer(ReactCmdDataProviderEnhancer)
CmdDataProvider.setEventNameGenerator(() => {
  const pathname = location.pathname;
  console.log("location.pathname", pathname);
  return `${ApplicationEventType.ROUTE}_${pathname}`;
});

import "@/provider/UserCmdDataProvider";

AntdPageHeaderEnhancer.setWrapperRender((ReactComponent: any, options: AntdRouteViewOptions, viewProps: any) => {
  console.log('viewProps', viewProps, options);
  const pageHeader = options.pageHeader || {};

  if (options.showMode === ViewShowMode.DIALOG || viewProps.viewShowModel === ViewShowMode.DIALOG) {
    // const [visible, setVisible] = useState(true);
    //
    // return <Modal
    //   title={viewProps.route.name}
    //   visible={true}
    //   width={"60%"}
    //   style={{marginLeft: 300}}
    //   onCancel={() => {
    //     setVisible(false);
    //     AppRouter.goBack();
    //   }}
    //   footer={visible}>
    //   <ReactComponent {...viewProps}/>
    // </Modal>
    return <ReactComponent {...viewProps}/>;
  }

  const showBack = !location.pathname.endsWith('/list');

  return <>
    <PageHeaderWrapper title={pageHeader.title || viewProps.route.name}
                       content={pageHeader.content}
                       backIcon={showBack ? <ArrowLeftOutlined/> : false}
                       onBack={() => AppRouter.goBack()}>
      <ReactComponent {...viewProps}/>
    </PageHeaderWrapper>
  </>
});

AntdPageHeaderEnhancer.setRenderNoAuthorityView((ReactComponent: any, options: AntdRouteViewOptions, viewProps: any) => {
  if (options.condition === USER_IS_LOGIN_CONDITION) {
    AppRouter.login();
    return null;
  }

  return <>
    <div>你没有访问该页面的权限 {options.condition}</div>
  </>
});

RouteView.addEnhancer(AntdPageHeaderEnhancer);
RouteView.setDefaultCondition(USER_IS_LOGIN_CONDITION);
RouteContextHolder.setRouteContextFactory(() => ({
  ...AppRouter.getCurrentObject(),
  loginUser: getLoginUser(),
} as AntdRouteContext));


const {pwa} = defaultSettings;
// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(formatMessage({id: 'app.pwa.offline'}));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({type: 'skip-waiting'}, [channel.port2]);
      });
      // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
      window.location.reload(true);
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {formatMessage({id: 'app.pwa.serviceworker.updated.ok'})}
      </Button>
    );
    notification.open({
      message: formatMessage({id: 'app.pwa.serviceworker.updated'}),
      description: formatMessage({id: 'app.pwa.serviceworker.updated.hint'}),
      btn,
      key,
      onClose: async () => {
      },
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const {serviceWorker} = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  });

  // remove all caches
  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
