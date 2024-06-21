import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import { darken } from "polished";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";
import { QueryGetUserCollections } from "../../graphql/get-user-collections.graphql";
import { MutationUpsertCollection } from "../../graphql/upsert-collection.graphql";
import ModalFastCreateCollection from "../../modals/ModalFastCreateCollection";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";
import { Select } from "../FormInputs/Select";
import ReCaptchaBanner from "../ReCaptchaBanner";
import { BatchCreateContext, CollectionInfo } from "./BatchCreateContext";

const { colors, typography } = variables;
const { neutrals } = colors;

export default function BatchCreateInfo() {
    const userAddress = useRecoilValue(userAddressSelector);
    const { collection, setCollection, increaseStep } =
        useContext(BatchCreateContext);

    const [isCollectionCreateOpen, setIsCollectionCreateOpen] = useState(false);
    const [hasCreateError, setHasCreateError] = useState(false);

    const { client } = useGraphQL();

    const { data, error, mutate } = useSWR(
        [QueryGetUserCollections, { userAddress }],
        (data, vars) => client.request(data, vars)
    );

    const collectionOptions: CollectionInfo[] = useMemo(
        () =>
            data?.getCollections?.items?.map((c: any) => ({
                label: c.name,
                id: c.collectionId,
            })),
        [data]
    );

    const onCollectionCreate = async (values: any) => {
        try {
            const res = await client.request(MutationUpsertCollection, {
                name: values.name,
                isVisible: !values.private,
            });

            if (res?.collection?.collectionId) {
                await mutate();
                toast.success("You've created a new collection!");
            }
        } catch (e: any) {
            console.warn(e?.message || e);
            setHasCreateError(true);
        } finally {
            setIsCollectionCreateOpen(false);
        }
    };

    if (error || hasCreateError) {
        return <FallbackInfo>An error occured.</FallbackInfo>;
    }

    return (
        <Container>
            <Select
                label="Collection Name"
                inputProps={{
                    name: "collection",
                    placeholder: !data ? "Loading..." : "Pick a collection",
                    options: collectionOptions,
                    isDisabled: !data,
                    value: {
                        label: collection?.label,
                        value: collection?.id || "",
                    },
                    onChange: (c: any) => {
                        setCollection(c);
                    },
                }}
            />

            <CreateDescription>
                Did you forget to create the collection?{" "}
                <CreateCollectionTextButton
                    onClick={() => setIsCollectionCreateOpen(true)}
                >
                    Create it now
                </CreateCollectionTextButton>
            </CreateDescription>

            <Button onClick={increaseStep}>Create NFTs</Button>

            <ReCaptchaBanner />

            <ModalFastCreateCollection
                isOpen={isCollectionCreateOpen}
                setIsOpen={setIsCollectionCreateOpen}
                onCollectionCreate={onCollectionCreate}
            />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 32px;
`;

const CreateCollectionTextButton = styled.span`
    cursor: pointer;
    font-weight: bold;
    color: ${colors.blue};
    transition: color 0.2s;

    &:hover {
        color: ${darken(0.1, colors.blue)};
    }
`;

const CreateDescription = styled.div`
    ${typography.caption2};
    margin-top: 4px;
    color: ${neutrals[4]};
`;

const FallbackInfo = styled.p`
    ${typography.body2}
    text-align: center;
    margin: auto;
    padding: 8px;
    color: ${neutrals[4]};
`;
