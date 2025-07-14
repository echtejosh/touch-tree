/**
 * Factory function type for creating service instances.
 */
type Factory<T> = (...props: never[]) => T;

/**
 * Class constructor type for creating service instances.
 */
type ClassConstructor<T> = new (...args: never[]) => T;

/**
 * Interface for a service container.
 */
interface ServiceContainerContract {
    /**
     * Registers a service as a singleton, creating a single shared instance.
     *
     * @param Service Factory or class constructor for the service type T
     * @param factory Factory to create the singleton instance, or class constructor
     * @returns The singleton instance of type T
     */
    register<T>(Service: Factory<T> | ClassConstructor<T>, factory: Factory<T> | ClassConstructor<T>): void;

    /**
     * Resolves a service instance, returning the singleton if registered or creating a new one if not.
     *
     * @param Service Factory or class constructor for the service type T
     * @returns The resolved instance of type T
     */
    resolve<T>(Service: Factory<T> | ClassConstructor<T>): T;
}

/**
 * Creates a new service container to manage service registration and resolution.
 *
 * @constructor
 */
function Container(): ServiceContainerContract {
    const instances = new Map<Factory<unknown> | ClassConstructor<unknown>, unknown>();

    /**
     * Registers a service as a singleton.
     *
     * @param Service Factory or class constructor for the service type T
     * @param factory Factory to create the instance, or class constructor
     */
    function register<T>(Service: Factory<T> | ClassConstructor<T>, factory: Factory<T> | ClassConstructor<T>): void {
        if (factory instanceof Function && (factory as ClassConstructor<T>).prototype) {
            instances.set(Service, new (factory as ClassConstructor<T>)());
        } else {
            instances.set(Service, (factory as Factory<T>)());
        }
    }

    /**
     * Resolves a service instance, registering it as a singleton if necessary.
     *
     * @param Service Factory or class constructor for the service type T
     * @returns The resolved instance of type T
     */
    function resolve<T>(Service: Factory<T> | ClassConstructor<T>): T {
        if (!instances.has(Service)) {
            let _instance: T;

            if (Service instanceof Function && (Service as ClassConstructor<T>).prototype) {
                _instance = new (Service as ClassConstructor<T>)();
            } else {
                _instance = (Service as Factory<T>)();
            }

            register(Service, (): T => _instance);

            return _instance;
        }

        return instances.get(Service) as T;
    }

    return {
        register,
        resolve,
    };
}

/**
 * @see Container
 */
export default Container();
