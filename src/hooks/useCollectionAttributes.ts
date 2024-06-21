import useGraphQL from "@/hooks/useGraphQL";
import React from "react";
import useSWR from "swr";
import {
    CollectionFragment,
    GetCollectionTokenAttributesQueryResult,
} from "../generated/graphql";

export const useCollectionAttributes = (collection: CollectionFragment) => {
    const { sdk } = useGraphQL();

    const { data: attributesData } = useSWR(
        [
            { collectionId: collection.collectionId },
            "GET_COLLECTION_TOKEN_ATTRIBUTES",
        ],
        (args) => sdk.GetCollectionTokenAttributes(args),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    // Manipulate attributes if necessary
    const attributes = React.useMemo(() => {
        if (attributesData?.attributes) {
            // [Genesis] Country property should be in alphabetic order
            if (
                collection.smartContractAddress ===
                "0x93Ae8aab337E58A6978E166f8132F59652cA6C56"
            ) {
                return attributesData.attributes.reduce(
                    (acc, { key, values }) => {
                        if (key === "Country") {
                            acc.push({
                                key,
                                values: values.sort((a, b) =>
                                    a.value.localeCompare(b.value)
                                ),
                            });
                        } else {
                            acc.push({ key, values });
                        }

                        return acc;
                    },
                    ([] as GetCollectionTokenAttributesQueryResult["attributes"])!
                );
            }

            return attributesData.attributes;
        }

        return undefined;
    }, [attributesData, collection.smartContractAddress]);

    return attributes;
};
