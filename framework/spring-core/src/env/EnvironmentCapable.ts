import {Environment} from "./Environment";

/**
 * Interface indicating a component that contains and exposes an {@link Environment} reference.
 *
 * <p>All Spring application contexts are EnvironmentCapable, and the interface is used primarily
 * for performing {@code instanceof} checks in framework methods that accept BeanFactory
 * instances that may or may not actually be ApplicationContext instances in order to interact
 * with the environment if indeed it is available.
 */
export interface EnvironmentCapable {
    /**
     * Return the {@link Environment} associated with this component.
     */
    getEnvironment: () => Environment;
}