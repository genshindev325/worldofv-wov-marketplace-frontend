import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

/**
 * Manually handle Popup's visiblity and routing
 */
export function usePopupHandler() {
    const router = useRouter();

    const [visible, setVisible] = useState(false);

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    useEffect(() => {
        router.events.on("routeChangeStart", hide);
        return () => {
            router.events.off("routeChangeStart", hide);
        };
    }, []);

    const handleEvent = useMemo(
        () =>
            debounce(() => {
                setVisible((v) => !v);
            }, 100),
        []
    );

    return {
        visible,
        show,
        hide,
        handleEvent,
    };
}
