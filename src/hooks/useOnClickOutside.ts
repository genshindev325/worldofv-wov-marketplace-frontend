/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import arePassiveEventsSupported from "are-passive-events-supported";
import React from "react";
import useLatest from "use-latest";

const MOUSE_DOWN = "mousedown";
const TOUCH_START = "touchstart";

type HandledEvents = [typeof MOUSE_DOWN, typeof TOUCH_START];
type HandledEventsType = HandledEvents[number];
type PossibleEvent = {
    [Type in HandledEventsType]: HTMLElementEventMap[Type];
}[HandledEventsType];
type Handler = (event: PossibleEvent) => void;

const events: HandledEvents = [MOUSE_DOWN, TOUCH_START];

const getAddOptions = (
    event: HandledEventsType
): AddEventListenerOptions | undefined => {
    if (event === TOUCH_START && arePassiveEventsSupported()) {
        return { passive: true };
    }
};

const currentDocument = typeof document !== "undefined" ? document : undefined;

export default function useOnClickOutside(
    ref: React.RefObject<HTMLElement>,
    handler: Handler | null,
    { document = currentDocument } = {}
) {
    if (typeof document === "undefined") {
        return;
    }

    const handlerRef = useLatest(handler);

    React.useEffect(() => {
        if (!handler) {
            return;
        }

        const listener = (event: PossibleEvent) => {
            if (
                !ref.current ||
                !handlerRef.current ||
                ref.current.contains(event.target as Node)
            ) {
                return;
            }

            handlerRef.current(event);
        };

        events.forEach((event) => {
            document.addEventListener(event, listener, getAddOptions(event));
        });

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, listener);
            });
        };
    }, [!handler]);
}
