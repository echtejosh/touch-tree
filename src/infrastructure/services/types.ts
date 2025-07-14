/**
 * Represents an endpoint.
 */
export interface Endpoint {
    /**
     * The method associated with the endpoint.
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
 * Represents a key-value object of endpoints.
 */
export type Endpoints = Record<string, Endpoint>;

/**
 *
 */
export interface ApiResponse {
    /**
     *
     */
    serverStatus: string | null;

    /**
     *
     */
    success: boolean;
}
