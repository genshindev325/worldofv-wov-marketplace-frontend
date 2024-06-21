import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const NEVER_RELOAD_PATHS: string[] = [];

const useBuildData = () => {
    const router = useRouter();

    const [buildId, setBuildId] = React.useState<string | null>(null);

    const { error } = useSWR(
        `/_next/static/${buildId}/_buildManifest.js`,
        async (url) => {
            if (!buildId) {
                return;
            }

            const response = await fetch(url + `?${new Date().getTime()}`);

            if (!response.ok) {
                throw new Error("refresh");
            }
        },
        { shouldRetryOnError: false }
    );

    React.useEffect(() => {
        const hasTargetFile = Array.from(document.querySelectorAll("script"))
            .map(({ src }) => src)
            .some((url) => url.includes("_buildManifest.js"));

        if (!hasTargetFile) {
            return;
        }

        const nextDataScript = document.querySelector("#__NEXT_DATA__");

        if (nextDataScript) {
            setBuildId(
                JSON.parse(nextDataScript.textContent as string).buildId
            );
        }
    }, []);

    const hasBuildId = Boolean(buildId);
    const hasError = Boolean(error);

    const canReload = NEVER_RELOAD_PATHS.every(
        (path) => !router.pathname.startsWith(path)
    );

    return {
        buildId,
        shouldReload: hasBuildId && hasError && canReload,
    };
};

export default useBuildData;
