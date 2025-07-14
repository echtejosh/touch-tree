import { Middleware, RequestBag, RequestBody } from 'domain/contracts/middleware/MiddlewareContract';
import obj from 'utils/obj';
import arr from 'utils/arr';
import url from 'utils/url';

/**
 *
 */
export interface RequestInfo {
    /**
     *
     */
    endpoint: Endpoint;

    /**
     *
     */
    body?: RequestBody;

    /**
     *
     */
    options?: RequestOptions;

    /**
     *
     */
    status?: number;
}

/**
 *
 */
export interface Endpoint {
    /**
     *
     */
    method: string;

    /**
     *
     */
    to: string;
}

/**
 *
 */
export interface RequestOptions {
    /**
     *
     */
    timeout?: number;

    /**
     *
     */
    params?: RequestBody;

    /**
     *
     */
    body?: RequestBody;
}

/**
 *
 */
interface RequestShape {
    /**
     *
     * @param body
     */
    send<T>(body?: RequestBody): Promise<T>;

    /**
     *
     * @param callback
     */
    onError(callback: (response: Response) => void): this;
}

/**
 *
 */
interface PreparedRequest {
    /**
     *
     */
    url: string;

    /**
     *
     */
    init: RequestInit;
}

/**
 *
 */
export interface HttpServiceContract {
    /**
     *
     */
    recent(): RequestInfo | null;

    /**
     *
     * @param fn
     */
    middleware(fn: Middleware[]): void;

    /**
     *
     * @param status
     * @param callback
     */
    on(status: number, callback: (response: Response) => void): void;

    /**
     *
     * @param endpoint
     * @param options
     */
    request(endpoint: Endpoint, options?: RequestOptions): RequestShape;
}

/**
 *
 * @constructor
 */
export default function HttpService(): HttpServiceContract {
    let _middleware: Middleware[] = [];
    let _recentRequest: RequestInfo | null = null;

    /**
     *
     */
    const _eventListeners: Record<string, (response: Response) => void> = {};

    /**
     *
     * @param fn Middleware functions
     */
    function middleware(fn: Middleware[]): void {
        _middleware = fn;
    }

    /**
     *
     * @param status HTTP status code
     * @param callback Event handler
     */
    function on(status: number, callback: (response: Response) => void): void {
        _eventListeners[String(status)] = callback;
    }

    /**
     *
     * @param endpoint
     * @param _request
     */
    function applyMiddleware(endpoint: Endpoint, _request: RequestBag): RequestBag {
        const bag = _middleware.reduce((opts, mw): RequestBag => mw(opts, endpoint), _request);

        bag.url.search = bag.params.toString();

        return bag;
    }

    /**
     *
     * @param endpoint Request endpoint
     * @param options Request options
     */
    function prepareRequest(endpoint: Endpoint, options?: RequestOptions): RequestBag {
        const _url = new URL(endpoint.to);

        const bag: RequestBag = {
            url: _url,
            params: new URLSearchParams(_url.search),
            body: options?.body,
        };

        return applyMiddleware(endpoint, bag);
    }

    /**
     *
     * @param ms Timeout in milliseconds
     */
    function createTimeoutSignal(ms: number): AbortSignal {
        const controller = new AbortController();

        setTimeout(() => controller.abort(), ms);

        return controller.signal;
    }

    /**
     *
     * @param method HTTP method
     * @param body Request body
     * @param _url
     * @param init Request init
     */
    function prepareRequestBody(method: string, body: RequestBody, _url: URL, init: RequestInit): PreparedRequest {
        if (method === 'GET') {
            const params = new URLSearchParams(_url.search);

            Object
                .entries(body ? obj.serialize(body) : {})
                .forEach(([key, value]) => params.set(key, value));

            return {
                url: url.addQueryParameters(_url, params),
                init,
            };
        }

        const _init: RequestInit = {
            ...init,
            body: JSON.stringify(body),
        };

        return {
            url: _url.toString(),
            init: _init,
        };
    }

    /**
     *
     * @param _url Request URL
     * @param init Request init
     */
    async function sendRequest(_url: string, init: RequestInit): Promise<Response> {
        const response = await fetch(_url, init);

        if (_recentRequest) {
            _recentRequest.status = response.status;
        }

        if (_eventListeners[response.status]) {
            _eventListeners[response.status](response);
        }

        return response;
    }

    /**
     *
     * @param endpoint Request endpoint
     * @param body Request body
     * @param options Request options
     */
    async function dispatch(endpoint: Endpoint, body?: RequestBody, options?: RequestOptions): Promise<Response> {
        const { url: _url } = prepareRequest(endpoint, options);

        const init: RequestInit = {
            method: endpoint.method,
            signal: options?.timeout ? createTimeoutSignal(options.timeout) : undefined,
        };

        const _request = body
            ? prepareRequestBody(endpoint.method, body, _url, init)
            : {
                url: _url.toString(),
                init,
            };

        return sendRequest(_request.url, _request.init);
    }

    /**
     *
     * @param endpoint Request endpoint
     * @param options Request options
     */
    function createRequest(endpoint: Endpoint, options: RequestOptions): RequestShape {
        let _onError: (response: Response) => void;
        let _this: RequestShape;

        /**
         *
         * @param callback Error handler
         */
        function onError(callback: (response: Response) => void): RequestShape {
            _onError = callback;

            return _this;
        }

        /**
         *
         * @param body Request body
         */
        async function send<U>(body?: RequestBody): Promise<U> {
            _recentRequest = {
                endpoint,
                body,
                options,
            };

            const response = await dispatch(endpoint, body, options);

            if (arr.range(400, 599).includes(response.status)) {
                _onError?.(response.clone());
            }

            try {
                return await response.clone().json();
            } catch (error) {
                return { response } as U;
            }
        }

        _this = {
            send,
            onError,
        };

        return _this;
    }

    /**
     *
     * @param endpoint Request endpoint
     * @param options Request options
     */
    function request(endpoint: Endpoint, options?: RequestOptions): RequestShape {
        const req = createRequest(endpoint, { timeout: 120000, ...options });

        req.onError(console.error);

        return req;
    }

    return {
        on,
        middleware,
        request,
        recent: (): RequestInfo | null => _recentRequest,
    };
}
