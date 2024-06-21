import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { PaginationArgs, UserOfferType } from "../generated/graphql";

// TODO: how can we add types to this thing??
export const useQueryGetOffersForUser = (
    address: string,
    type: UserOfferType,
    pagination: PaginationArgs
) => {
    const acceptorAddress = useRecoilValue(userAddressSelector);
    const { sdk } = useGraphQL();

    const { data, mutate, isValidating } = useSWR(
        [
            {
                address,
                acceptorAddress,
                type,
                pagination,
            },
            "GET_OFFERS_FOR_USER", // unique id used for caching
        ],
        (args) => sdk.GetOffersForUser(args)
    );

    return [data?.getOffersForUser, mutate, isValidating] as const;
};
