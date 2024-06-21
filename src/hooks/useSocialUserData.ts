import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { isEmail } from "class-validator";
import { useMemo } from "react";
import useSWR from "swr";

export default function useSocialUserData() {
    const { web3AuthService } = useBlockchain();

    const { data, error, isValidating } = useSWR(
        web3AuthService ? "SOCIAL_USER_DATA" : null,
        () => web3AuthService!.getUserInfo(),
        { revalidateOnFocus: false }
    );

    const user = useMemo(() => {
        if (!data) return;

        const name = !isEmail(data.name) ? data.name : undefined;
        const firstName = name?.split(/\s+/, 1)?.[0]?.trim();
        const lastName = name?.split(/\s+/)?.slice(1)?.join(" ")?.trim();

        return { ...data, name, firstName, lastName };
    }, [data]);

    return { user, error, isValidating };
}
