import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

/**
 * Retrieve the currenly selected tab from the provided query parameter.
 */
export default function useQueryTab<T extends { value: string | string[] }>(
    tabs: T[],
    defaultIndex = 0,
    parameterName = "tab"
) {
    const router = useRouter();

    const selectedTab = useMemo(() => {
        const routerTab = router.query[parameterName] as string;

        let tab = tabs.find((i) =>
            Array.isArray(i.value)
                ? i.value.includes(routerTab)
                : i.value === routerTab
        );

        if (!tab) tab = tabs[defaultIndex];

        const value = Array.isArray(tab.value)
            ? tab.value.find((v) => v === routerTab) || tab.value[0]
            : tab.value;

        return { ...tab, value };
    }, [router.query, parameterName, tabs, defaultIndex]);

    const setSelectedTab = useCallback(
        (value: string | string[]) => {
            if (Array.isArray(value)) value = value[0];
            const url = new URL(window.location.href);
            url.searchParams.set(parameterName, value);
            router.replace(url, undefined, { shallow: true });
        },
        [parameterName, router]
    );

    return { tabs, selectedTab, setSelectedTab };
}
