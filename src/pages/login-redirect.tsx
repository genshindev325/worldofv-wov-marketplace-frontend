import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import FlatLoader from "@/components/FlatLoader";
import usePersistentRedirect from "@/hooks/usePersistentRedirect";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoginRedirect() {
    const { user } = useUserData();
    const { web3AuthService, walletService } = useBlockchain();
    const router = useRouter();
    const [error, setError] = useState<any>();
    const { redirectToLastSavedUrl } = usePersistentRedirect();

    useEffect(() => {
        if (user && web3AuthService) {
            web3AuthService
                .init()
                .then(() => {
                    redirectToLastSavedUrl();
                })
                .catch((error) => {
                    console.warn(error?.message || error);
                    setError(error);
                });
        }
    }, [redirectToLastSavedUrl, router, user, walletService, web3AuthService]);

    return (
        <Flex
            flex="1"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            {error ? (
                <Text variant="h3" textAlign="center">
                    An error occured while logging in.
                </Text>
            ) : (
                <FlatLoader size={64} />
            )}
        </Flex>
    );
}

LoginRedirect.noHeader = true;
LoginRedirect.noFooter = true;
