import { AppCommandBroadcaster } from 'fengwuxp-declarative-broadcast-adapter';

/**
 *
 * @param pathPrefix
 */
declare const reactNativeAppCommandBroadcasterFactory: <T extends AppCommandBroadcaster>(pathPrefix?: string) => T;

export { reactNativeAppCommandBroadcasterFactory };
