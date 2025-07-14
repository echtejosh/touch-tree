/**
 * A type representing a request body.
 */
export type RequestBody = Record<string, unknown>;

/**
 * Interface representing the details of a request, including URL, query parameters, and an optional request body.
 */
export interface RequestBag {
    /**
     * The full URL of the request.
     */
    url: URL,

    /**
     * Query parameters to be appended to the URL.
     */
    params: URLSearchParams,

    /**
     * Optional request body containing data to be sent with the request.
     */
    body?: RequestBody
}

/**
 * Represents an API route.
 */
export interface EndpointShape {
    /**
     * The HTTP method associated with the route.
     */
    method: string;

    /**
     * The unique identifier for the route.
     */
    to: string;

    /**
     * Indicates whether the route requires an authentication token.
     */
    token?: boolean;
}

/**
 * A type for a middleware function that processes the request and endpoint, returning a modified RequestBag.
 *
 * @param request The RequestBag containing the request details.
 * @param endpoint The Endpoint that defines the target route.
 *
 * @returns The RequestBag.
 */
export type Middleware = (request: RequestBag, endpoint: EndpointShape) => RequestBag;

/**
 * Interface representing a contract for middleware, with a handle method that processes requests.
 */
export interface MiddlewareContract {
    /**
     * A method to process the request using a middleware function.
     *
     * @param options The RequestBag containing the request details.
     * @param endpoint The Endpoint that defines the target route.
     *
     * @returns The RequestBag.
     */
    handle: Middleware;
}
