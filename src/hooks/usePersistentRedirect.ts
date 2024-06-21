import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

/**
 * When we log in using web3auth we will be redirected away from the site so
 * all state will be lost. We save the redirect url in session storage so we
 * can get back to the previous page when we come back to the website.
 *
 * This hook is only meant to be used when on client side since it needs access
 * to session storage.
 *
 * `setRedirectUrl` will save the url for the next time `redirectToLastSavedUrl` is called.
 *
 * `redirectToLastSavedUrl` will redirect to the saved url and clear the storage.
 */
export default function usePersistentRedirect(fallback = "/") {
    const [redirectUrl, setRedirectUrlState] = useState<string>(fallback);
    const router = useRouter();

    useEffect(() => {
        setRedirectUrlState(sessionStorage.getItem("redirectUrl") || fallback);
    }, [fallback]);

    const redirectToLastSavedUrl = useCallback(() => {
        sessionStorage.removeItem("redirectUrl");
        router.replace(redirectUrl || fallback);
    }, [fallback, redirectUrl, router]);

    const setRedirectUrl = useCallback((redirectUrl: string) => {
        sessionStorage.setItem("redirectUrl", redirectUrl);
        setRedirectUrlState(redirectUrl);
    }, []);

    return { redirectToLastSavedUrl, setRedirectUrl };
}
