import { Map, Set } from "immutable";
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type AsyncFn = () => Promise<void> | void;

interface RefreshContext {
    // Map from [listener id] -> [handler]
    handlers: Map<number, AsyncFn>;
    setHandlers: Dispatch<SetStateAction<Map<number, AsyncFn>>>;

    // Map from [listener key] -> [listener ids]
    listeners: Map<string, Set<number>>;
    setListeners: Dispatch<SetStateAction<Map<string, Set<number>>>>;
}

const RefreshContext = createContext<RefreshContext>({
    handlers: Map(),
    setHandlers: () => {},
    listeners: Map(),
    setListeners: () => {},
});

export function RefreshProvider(props: PropsWithChildren<{}>) {
    const [handlers, setHandlers] = useState(Map<number, AsyncFn>());
    const [listeners, setListeners] = useState(Map<string, Set<number>>());

    return (
        <RefreshContext.Provider
            value={{ handlers, setHandlers, listeners, setListeners }}
            {...props}
        />
    );
}

/**
 * Subscribe to refresh events for the provided key.
 *
 * When the `refresh` function from the `useRefresh` hook is called with a
 * matching key the provided `handler` will be executed.
 */
export function useRefreshListener(key: string, handler: AsyncFn) {
    const { setListeners, setHandlers } = useContext(RefreshContext);

    const listenerId = useMemo(
        () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        []
    );

    const addListener = () => {
        setHandlers((handlers) => handlers.set(listenerId, handler));
        setListeners((listeners) => {
            const currentListeners = listeners.get(key) || Set();
            const nextListeners = currentListeners.add(listenerId);
            return listeners.set(key, nextListeners);
        });
    };

    const removeListener = () => {
        setHandlers((handlers) => handlers.remove(listenerId));
        setListeners((listeners) => {
            const currentListeners = listeners.get(key) || Set();
            const nextListeners = currentListeners.remove(listenerId);
            return listeners.set(key, nextListeners);
        });
    };

    useEffect(
        () => {
            addListener();
            return () => removeListener();
        },
        [key] // eslint-disable-line react-hooks/exhaustive-deps
    );
}

/**
 * Trigger a refresh event for the provided keys.
 *
 * Calling the returning function will trigger a refresh event for all matching
 * listeners.
 */
export function useRefresh(...keys: string[]) {
    const { listeners, handlers } = useContext(RefreshContext);

    const handler = useCallback(async () => {
        for (const key of keys) {
            const handlerIds = listeners.get(key)?.valueSeq()?.toArray() || [];

            for (const handlerId of handlerIds) {
                const handler = handlers.get(handlerId);
                await handler?.();
            }
        }
    }, [handlers, keys, listeners]);

    return handler;
}
