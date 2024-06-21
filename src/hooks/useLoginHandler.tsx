import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { LOGIN_PROVIDER_TYPE } from "@toruslabs/openlogin";
import { ExtraLoginOptions } from "@toruslabs/openlogin-utils";
import { useCallback, useMemo, useState } from "react";

export function useLoginHandler(
    loginProvider: LOGIN_PROVIDER_TYPE | "connex",
    extraLoginOptions?: ExtraLoginOptions
) {
    const { walletService } = useBlockchain();

    const [isLoggingIn, setLoggingIn] = useState(false);
    const [error, setError] = useState<any>();

    const login = useCallback(async () => {
        try {
            setLoggingIn(true);
            setError(undefined);
            await walletService!.login(loginProvider, extraLoginOptions);
        } catch (error: any) {
            console.warn(error?.message || error);
            setError(error);
        } finally {
            setLoggingIn(false);
        }
    }, [extraLoginOptions, loginProvider, walletService]);

    const isDisabled = useMemo(() => {
        const isSync1 =
            typeof navigator === "object"
                ? navigator.userAgent.includes("Sync/")
                : false;

        // Sync1 does not support web3Auth so the library cannot be initialized.
        const isUnsupported = isSync1 && loginProvider !== "connex";

        return !walletService || isUnsupported;
    }, [loginProvider, walletService]);

    return { login, isLoggingIn, error, isDisabled };
}
