import useGraphQL from "@/hooks/useGraphQL";
import { useCallback } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import styled from "styled-components";
import useSWR from "swr";
import variables from "../../styles/_variables";
import { ISelectedTokenAttributes } from "../../types/TokenData";
import CollectionFilterByTraitsButton from "../collection/CollectionFilterByTraitsButton";
import FlatLoader from "../FlatLoader";
import { Field } from "./Field";

const { colors, typography } = variables;

interface PropertiesSelectProps {
    collectionId: string;
    selectedProperties?: ISelectedTokenAttributes;
    onSelectProperties: (props: ISelectedTokenAttributes | undefined) => void;
}

function PropertiesSelect({
    collectionId,
    selectedProperties,
    onSelectProperties,
}: PropertiesSelectProps) {
    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data: attributesData, error } = useSWR(
        [
            `query GetCollectionTokenAttributes($collectionId: String!) {
            attributes: getCollectionTokenAttributes(collectionId: $collectionId) {
                key
                values {
                    value
                    count
                }
            }
        }`,
            { collectionId },
        ],
        fetcher
    );

    return (
        <PropertiesContainer>
            {error ? (
                <Field>
                    <FaExclamationTriangle size={24} color={colors.red} />
                    <ErrorMessage>An error occured.</ErrorMessage>
                </Field>
            ) : !attributesData ? (
                <Field>
                    <FlatLoader size={24} style={{ margin: "auto" }} />
                </Field>
            ) : (
                <CollectionFilterByTraitsButton
                    options={attributesData?.attributes}
                    selectedProperties={selectedProperties}
                    onSelectProperties={onSelectProperties}
                />
            )}
        </PropertiesContainer>
    );
}

const ErrorMessage = styled.p`
    ${typography.caption1}
    margin-left: 16px;
    white-space: nowrap;
`;

const PropertiesContainer = styled.div`
    min-width: 192px;
`;

export default PropertiesSelect;
