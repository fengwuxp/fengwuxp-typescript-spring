import {
  AppCommandBroadcaster,
  EmitEventMethod,
  ReceiveEventListenerMethod,
} from 'fengwuxp-declarative-broadcast-adapter'
import {tarojsAppCommandBroadcasterFactory} from 'fengwuxp-tarojs-broadcast'


/**
 * 应用广播事件定义
 */
export interface AppBroadcasterInterface extends AppCommandBroadcaster {

  sendMemberLogin: EmitEventMethod<any>,

  receiveMemberLogin: ReceiveEventListenerMethod<any>

}

export const AppBroadcaster = tarojsAppCommandBroadcasterFactory<AppBroadcasterInterface>();

