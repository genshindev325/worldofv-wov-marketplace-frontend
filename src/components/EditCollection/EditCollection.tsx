import useGraphQL from "@/hooks/useGraphQL";
import { useUserDataLegacy } from "@/hooks/useUserData";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import {
    COLLECTION_MAX_FILE_SIZE_BYTES,
    SUPPORTED_IMAGE_MIME_TYPES,
} from "../../constants/upload";
import { MutationDeleteCollection } from "../../graphql/delete-collection.graphql";
import { MutationUpsertCollection } from "../../graphql/upsert-collection.graphql";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import isSupportedFormat from "../../utils/isSupportedFormat";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { Field } from "../FormInputs/Field";
import Form from "../FormInputs/Form";
import ImageUpload from "../FormInputs/ImageUpload";
import { Input } from "../FormInputs/Input";
import SwitchField from "../FormInputs/SwitchField";
import { Textarea } from "../FormInputs/Textarea";
import EditCollectionTop from "./EditCollectionTop";

const { media, dark } = mixins;
const { container } = common;
const {
    colors: { neutrals },
    typography: { bodyBold2 },
} = variables;

interface EditCollectionProps {
    collection?: any;
}

type FormData = {
    image: FileList;
    name: string;
    description?: string;
    private?: boolean;
};

const validationSchema = yup.object().shape({
    image: yup
        .mixed()
        .test(
            "fileSize",
            "File too large",
            (value: FileList) =>
                !value.length || value[0].size <= COLLECTION_MAX_FILE_SIZE_BYTES
        )
        .test("fileType", "Unsupported file format", (value: FileList) =>
            value.length
                ? isSupportedFormat(value[0], SUPPORTED_IMAGE_MIME_TYPES)
                : true
        ),
    name: yup
        .string()
        .required()
        .transform((value) => value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")),
    description: yup.string(),
    private: yup.boolean(),
});

const EditCollection: React.FC<EditCollectionProps> = ({ collection }) => {
    const router = useRouter();
    const user = useUserDataLegacy();
    const { client } = useGraphQL();

    const onSubmit = async ({ image, ...values }: FormData) => {
        const file = image?.length ? image[0] : undefined;

        const identifier = collection?.collectionId
            ? { collectionId: collection.collectionId }
            : { name: values.name };

        const res = await client.request(MutationUpsertCollection, {
            ...identifier,
            description: values.description,
            isVisible: !values.private,
            thumbnailImage: file,
        });

        if (res?.collection?.collectionId) {
            toast.success(
                res.collection.collectionId
                    ? "The collection has been updated successfully!"
                    : "You've created a new collection!"
            );

            router.push(`/collection/${res.collection.collectionId}`);
        } else {
            toast.error(
                res.message ||
                    res.error ||
                    "An error occurred while processing your request"
            );
        }
    };

    const onDelete = async () => {
        if (collection?.collectionId) {
            const res = await client
                .request(MutationDeleteCollection, {
                    collectionId: collection.collectionId,
                })
                .catch((err) => {
                    console.warn(err);
                    return { deleteCollection: { done: false } };
                });

            if (res.deleteCollection.done) {
                toast.success("Collection deleted successfully!");
                router.push(`/profile/${user?.profileIdentifier}`);
            } else {
                toast.error(
                    res.message ||
                        res.error ||
                        "An error occurred while processing your request"
                );
            }
        }
    };

    return (
        <Container>
            <EditCollectionTop {...{ collection }} />

            <Form<FormData>
                {...{ onSubmit, validationSchema }}
                render={({ formState: { isValid, isSubmitting } }) => (
                    <DetailsRow>
                        <DetailsColumn>
                            <DetailsList>
                                <DetailsItem>
                                    <ImageUpload
                                        label="Collection image"
                                        description="Recommended minimum size 400x400 pixels."
                                        imageSrc={collection?.thumbnailImageUrl}
                                        inputProps={{
                                            name: "image",
                                            accept: SUPPORTED_IMAGE_MIME_TYPES.join(
                                                ","
                                            ),
                                        }}
                                    />
                                </DetailsItem>
                            </DetailsList>

                            {collection?.collectionId &&
                                !collection?.blockchainId && (
                                    <DetailsDelete>
                                        <Alert
                                            title="Delete collection"
                                            text="Collection can only be deleted if no NFTs have been minted in it"
                                        />

                                        <Button
                                            disabled={isSubmitting}
                                            onClick={onDelete}
                                        >
                                            Delete
                                        </Button>
                                    </DetailsDelete>
                                )}
                        </DetailsColumn>

                        <DetailsColumn>
                            <DetailsList>
                                <DetailsItem>
                                    <DetailsCategory>
                                        Collection info
                                    </DetailsCategory>

                                    <DetailsFieldset>
                                        <Input
                                            label="Collection name"
                                            inputProps={{
                                                name: "name",
                                                placeholder:
                                                    "Enter the collection name",
                                                defaultValue: collection?.name,
                                                readOnly: !!collection,
                                            }}
                                        />

                                        <Textarea
                                            label="Description"
                                            inputProps={{
                                                name: "description",
                                                placeholder:
                                                    "Describe your collection in a few words",
                                                defaultValue:
                                                    collection?.description,
                                            }}
                                        />
                                    </DetailsFieldset>
                                </DetailsItem>
                            </DetailsList>

                            <DetailsList>
                                <DetailsItem>
                                    <SwitchField
                                        label="Private"
                                        description={`Enable this option to make your collection private.\nIt won't be displayed in the search bar and it won't appear in your profile or in the marketplace.`}
                                        inputProps={{
                                            name: "private",
                                            defaultChecked: collection
                                                ? !collection.isVisible
                                                : false,
                                        }}
                                    />
                                </DetailsItem>
                            </DetailsList>

                            <DetailsButtons>
                                <Button
                                    type="submit"
                                    loader={isSubmitting}
                                    disabled={!isValid || isSubmitting}
                                >
                                    {collection?.collectionId
                                        ? "Edit"
                                        : "Create"}{" "}
                                    collection
                                </Button>

                                <Button
                                    outline
                                    disabled={isSubmitting}
                                    onClick={router.back}
                                >
                                    Cancel
                                </Button>
                            </DetailsButtons>
                        </DetailsColumn>
                    </DetailsRow>
                )}
            />
        </Container>
    );
};

const Container = styled.div`
    ${container}
    max-width: 896px;
`;

const DetailsRow = styled.div`
    display: flex;
    margin: 0 -16px;

    ${media.d`
        display: block;
        margin: 0;
    `}
`;

const DetailsColumn = styled.div`
    flex: 0 0 calc(50% - 32px);
    width: calc(50% - 32px);
    margin: 0 16px;

    ${media.d`
        width: 100%;
        margin: 0;
    `}

    &:not(:last-child) {
        ${media.d`
            margin-bottom: 32px;
            border-bottom: 1px solid ${neutrals[6]};

            ${dark`
                border-color: ${neutrals[3]};
            `}
        `}
    }
`;

const DetailsList = styled.div`
    margin-bottom: 32px;

    ${media.d`
        display: flex;
        margin: 0 0 32px;
    `}

    ${media.m`
        display: block;
        margin: 0 0 32px;
    `}

    &:not(:first-child) {
        border-top: 1px solid ${neutrals[6]};
        padding-top: 32px;

        ${dark`
            border-color: ${neutrals[3]};
        `}
    }
`;

const DetailsItem = styled.div`
    width: 100%;
    margin: 0;

    &:not(:last-child) {
        margin-bottom: 32px;

        ${media.d`
            margin-bottom: 0;
        `}
    }
`;

const DetailsCategory = styled.div`
    margin-bottom: 32px;
    ${bodyBold2}
`;

const DetailsFieldset = styled.div`
    & > ${Field.displayName} {
        &:not(:last-child) {
            margin-bottom: 32px;
        }
    }
`;

const DetailsDelete = styled.div`
    margin: 32px 0;
    padding-top: 32px;
    border-top: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}

    ${Button.displayName} {
        ${media.m`
            width: 100%;
        `}

        margin-top: 16px;
    }
`;

const DetailsButtons = styled.div`
    display: flex;
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid ${neutrals[6]};

    ${media.m`
        display: block;
        text-align: center;
    `}

    ${dark`
        border-color: ${neutrals[3]};
    `}

    ${Button.displayName} {
        ${media.m`
            width: 100%;
        `}

        &:not(:last-child) {
            margin-right: 16px;
        }
    }
`;

export default EditCollection;
