import { GetWoVCollectionsByBrandQueryResult } from "@/generated/graphql";
import useGraphQL from "@/hooks/useGraphQL";
import { GraphQLService } from "@/services/GraphQLService";
import { NextPage, NextPageContext } from "next";
import React, { useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";
import CollectionsGrid from "../components/Collections/CollectionsGrid";
import CollectionsHero from "../components/Collections/CollectionsHero";
import Head from "../components/Head";
import { QuerySearchCollectionsByString } from "../graphql/search-collection-by-string.graphql";
import common from "../styles/_common";

const { containerFluid } = common;

interface CollectionsPageProps {
    collections: NonNullable<
        GetWoVCollectionsByBrandQueryResult["collections"]
    >;
    brandId?: string;
}

const Collections: NextPage<CollectionsPageProps> = ({
    collections,
    brandId,
}) => {
    const [searchText, setSearchText] = React.useState("");
    const [shouldFetch, setShouldFetch] = React.useState(false);
    const [filterdCollections, setFilteredCollections] =
        React.useState(collections);

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data } = useSWR(
        shouldFetch
            ? [
                  QuerySearchCollectionsByString,
                  {
                      text: searchText,
                  },
              ]
            : null,
        fetcher
    );

    React.useEffect(() => {
        if (searchText.length >= 3) {
            setShouldFetch(true);
        } else {
            setFilteredCollections(collections);
            setShouldFetch(false);
        }
    }, [searchText, collections, filterdCollections]);

    React.useEffect(() => {
        if (data && data.searchCollectionsByString.collections) {
            const collectionIdsHash: Record<string, any> = {};
            data.searchCollectionsByString.collections.forEach(
                (collection: Record<string, any>) =>
                    (collectionIdsHash[collection.collectionId as string] =
                        true)
            );
            const filteredCollectionsRes = collections.filter(
                (collection) => collectionIdsHash[collection.collectionId]
            );
            setFilteredCollections(filteredCollectionsRes);
        }
    }, [data, collections]);

    return (
        <>
            <Head title="Collections" />

            <Container>
                <InnerContainer>
                    {!brandId && (
                        <CollectionsHero
                            searchText={searchText}
                            setSearchText={setSearchText}
                        />
                    )}
                    <CollectionsGrid {...{ collections: filterdCollections }} />
                </InnerContainer>
            </Container>
        </>
    );
};

const Container = styled.div`
    ${containerFluid};
`;

const InnerContainer = styled.div`
    padding-top: 64px;
    padding-bottom: 64px;
`;

export async function getServerSideProps(context: NextPageContext) {
    const brandId = (context.query.brand_id as string) || null;

    const { collections } = await GraphQLService.sdk().GetWoVCollectionsByBrand(
        { brandId }
    );

    if (collections?.length) {
        return {
            props: { collections, brandId },
        };
    }

    return {
        redirect: {
            destination: "/",
        },
    };
}

export default Collections;
