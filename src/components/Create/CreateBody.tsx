import { useBlockchain } from "@/blockchain/BlockchainProvider";
import useGraphQL from "@/hooks/useGraphQL";
import { useUserDataLegacy } from "@/hooks/useUserData";
import { useMediaQuery } from "@react-hook/media-query";
import _ from "lodash";
import { useRouter } from "next/router";
import { darken } from "polished";
import React, { useMemo } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import * as yup from "yup";
import CATEGORIES from "../../constants/categories";
import {
    MAX_EDITION_COUNT,
    SINGLE_MINT_MAX_FILE_SIZE_BYTES,
    SUPPORTED_MIME_TYPES,
} from "../../constants/upload";
import { QueryGetUserCollections } from "../../graphql/get-user-collections.graphql";
import { MutationUpsertCollection } from "../../graphql/upsert-collection.graphql";
import ModalFastCreateCollection from "../../modals/ModalFastCreateCollection";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { CollectionInfo } from "../BatchCreate/BatchCreateContext";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { useConnex } from "../ConnexProvider";
import { Field } from "../FormInputs/Field";
import Form from "../FormInputs/Form";
import { Input } from "../FormInputs/Input";
import { OptionItemProps, Select } from "../FormInputs/Select";
import Slider from "../FormInputs/Slider";
import SwitchField from "../FormInputs/SwitchField";
import { Textarea } from "../FormInputs/Textarea";
import Link from "../Link";
import Preview from "../Preview/Preview";
import ReCaptchaBanner from "../ReCaptchaBanner";
import { useCreate } from "./CreateProvider";
import CreateUploadFile from "./CreateUploadFile";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { bodyBold2, caption2 },
    breakpoints,
} = variables;

export type FormData = {
    file: File;
    name: string;
    description?: string;
    royalty?: number;
    categories?: OptionItemProps[];
    isMultipleEditions: boolean;
    editionsCount?: number;
    isCollectionEnabled: boolean;
    collection?: OptionItemProps;
};

const validationSchema = yup.object().shape({
    file: yup.mixed().required(),
    name: yup.string().required(),
    description: yup.string(),
    royalty: yup.number(),
    categories: yup.array(),
    isMultipleEditions: yup.boolean(),
    editionsCount: yup
        .number()
        .positive()
        .nullable(true)
        .transform((v) => (v === "" || Number.isNaN(v) ? null : v))
        .max(MAX_EDITION_COUNT)
        .when("isMultipleEditions", {
            is: true,
            then: yup.number().nullable(true).required(),
        }),
    isCollectionEnabled: yup.boolean(),
    collection: yup.object().when("isCollectionEnabled", {
        is: true,
        then: yup
            .object()
            .shape({
                label: yup.string().required(),
                value: yup.string().required(),
            })
            .required(),
    }),
});

const CreateBody = () => {
    const router = useRouter();
    const user = useUserDataLegacy();
    const { sdk, client } = useGraphQL();

    const { setFormValues, formValues } = useCreate();
    const { mintToken } = useConnex();
    const { transactionService } = useBlockchain();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [isCollectionCreateOpen, setIsCollectionCreateOpen] =
        React.useState(false);

    const { data, mutate } = useSWR(
        [QueryGetUserCollections, { userAddress: user?.address }],
        (data, vars) => client.request(data, vars)
    );

    const collectionOptions: CollectionInfo[] = useMemo(
        () =>
            data?.getCollections?.items?.map((c: any) => ({
                label: c.name,
                value: c.collectionId,
            })),
        [data]
    );

    const showPreview = useMediaQuery(
        `only screen and (max-width: ${breakpoints.t})`
    );

    const categoriesOptions = CATEGORIES;

    if (!user) {
        return null;
    }

    const onCollectionCreate = async (values: any) => {
        const res = await client.request(MutationUpsertCollection, {
            name: values.name,
            isVisible: !values.private,
        });

        if (res?.collection?.collectionId) {
            await mutate();
            toast.success("You've created a new collection!");
            setIsCollectionCreateOpen(false);
        } else {
            toast.error(
                res?.message ||
                    res?.error ||
                    "An error occurred while processing your request"
            );
        }
    };

    const onSubmit = async (values: FormData) => {
        values.collection =
            values?.isCollectionEnabled && values.collection?.value
                ? values.collection
                : undefined;

        values.editionsCount = values?.isMultipleEditions
            ? Math.max(
                  Math.min(values.editionsCount || 0, MAX_EDITION_COUNT),
                  1
              )
            : 1;

        const categories = values.categories?.map(({ value }) =>
            value.toUpperCase()
        );

        try {
            const captchaToken = await executeRecaptcha!("pin_metadata");

            const { data } = await sdk.PinMetadataToArweave(
                {
                    image: values.file,
                    name: values.name,
                    description: values.description,
                    categories: categories,
                    collectionName: values.collection?.label,
                },
                { "g-recaptcha-response": captchaToken }
            );

            const res = await mintToken({
                metadataHash: data.metadataTxId,
                fileHash: data.imageTxId,
                editionsCount: values.editionsCount || 1,
                royalty: values.royalty,
                tokenName: values.name,
                collectionName: values.collection?.label,
            });

            const [event] = await transactionService!.checkTransaction({
                txID: res.txid,
                eventNames: ["woviesCreation"],
            });

            router.push(
                `/token/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}/${event.returnValues.woviesId}`
            );
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <Container>
            <Form<FormData>
                {...{ onSubmit, validationSchema }}
                render={({
                    formState: { isValid, isSubmitting },
                    watch,
                    control,
                }) => {
                    const isMultipleEdition = watch("isMultipleEditions");
                    const isCollectionEnabled = watch("isCollectionEnabled");

                    // TODO: switch to the `useForm` hook and implement this
                    // properly.
                    const values = watch();
                    if (!_.isEqual(formValues, values)) setFormValues(values);

                    return (
                        <>
                            <CreateList>
                                <CreateItem>
                                    <Controller
                                        name={"file"}
                                        control={control}
                                        render={({ field: { onChange } }) => (
                                            <CreateUploadFile
                                                onChange={(f) => {
                                                    console.log(f);
                                                    onChange(f);
                                                }}
                                                accept={SUPPORTED_MIME_TYPES}
                                                maxSize={
                                                    SINGLE_MINT_MAX_FILE_SIZE_BYTES
                                                }
                                            />
                                        )}
                                    />

                                    <CreateCategory>NFT Details</CreateCategory>

                                    <CreateFieldset>
                                        <Input
                                            label="Item name"
                                            inputProps={{
                                                name: "name",
                                                placeholder:
                                                    "e.g. “Awesome NFT",
                                            }}
                                        />

                                        <Textarea
                                            label="Description"
                                            inputProps={{
                                                name: "description",
                                                placeholder:
                                                    "e.g. ”Don't miss your chance to own the Awesome NFT Collective on…”",
                                            }}
                                        />

                                        <FieldRow>
                                            <FieldColumn>
                                                <Slider
                                                    label="Royalties"
                                                    suffix="%"
                                                    inputProps={{
                                                        name: "royalty",
                                                        max: 25,
                                                    }}
                                                />
                                            </FieldColumn>

                                            <FieldColumn>
                                                <Select
                                                    label="Categories"
                                                    inputProps={{
                                                        name: "categories",
                                                        placeholder:
                                                            "Select one or more category",
                                                        options:
                                                            categoriesOptions,
                                                        isMulti: true,
                                                    }}
                                                />
                                            </FieldColumn>
                                        </FieldRow>
                                    </CreateFieldset>
                                </CreateItem>
                            </CreateList>

                            <CreateList>
                                <SwitchField
                                    label="Multiple Editions"
                                    description="Enable this option if you want to mint multiple editions of this item"
                                    inputProps={{ name: "isMultipleEditions" }}
                                />

                                {isMultipleEdition && (
                                    <Input
                                        label={`Edition count (Max ${MAX_EDITION_COUNT})`}
                                        inputProps={{
                                            type: "number",
                                            name: "editionsCount",
                                            placeholder:
                                                "Enter the number of editions",
                                        }}
                                    />
                                )}
                            </CreateList>

                            <CreateList>
                                <SwitchField
                                    label="Collection"
                                    description="Enable this option if you want to add this NFT to a collection"
                                    inputProps={{ name: "isCollectionEnabled" }}
                                />

                                {isCollectionEnabled && (
                                    <>
                                        <Select
                                            label="Collection Name"
                                            inputProps={{
                                                name: "collection",
                                                placeholder:
                                                    "Select a collection",
                                                options: collectionOptions,
                                                menuPlacement: "top",
                                            }}
                                        />

                                        <CreateDescription>
                                            Did you forget to create the
                                            collection?{" "}
                                            <CreateCollectionTextButton
                                                onClick={() =>
                                                    setIsCollectionCreateOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                Create it now
                                            </CreateCollectionTextButton>
                                        </CreateDescription>
                                    </>
                                )}
                            </CreateList>

                            <CreateFooter>
                                {!user.canMint && (
                                    <Alert
                                        title={
                                            user.blacklisted
                                                ? "Your account has been banned"
                                                : "Your profile is not complete"
                                        }
                                        text={
                                            user.blacklisted ? (
                                                "If your account has been mistakenly banned, please contact an administrator"
                                            ) : (
                                                <>
                                                    To be able to mint please{" "}
                                                    <Link
                                                        href="/profile/edit"
                                                        passHref
                                                    >
                                                        <a>
                                                            update your profile
                                                        </a>
                                                    </Link>{" "}
                                                    details
                                                </>
                                            )
                                        }
                                    />
                                )}

                                {showPreview && (
                                    <Flex justifyContent="center" pb={4}>
                                        <Preview
                                            // cardOnly
                                            description="See how your piece will look in the marketplace"
                                        />
                                    </Flex>
                                )}

                                <Button
                                    type="submit"
                                    loader={isSubmitting}
                                    disabled={
                                        !isValid ||
                                        isSubmitting ||
                                        !user.canMint ||
                                        !transactionService ||
                                        !executeRecaptcha
                                    }
                                >
                                    Create NFT
                                </Button>

                                <ReCaptchaBanner />
                            </CreateFooter>
                        </>
                    );
                }}
            />

            <ModalFastCreateCollection
                isOpen={isCollectionCreateOpen}
                setIsOpen={setIsCollectionCreateOpen}
                onCollectionCreate={onCollectionCreate}
            />
        </Container>
    );
};

const Container = styled.div``;

const CreateList = styled.div`
    margin-bottom: 32px;
    padding-bottom: 32px;

    &:not(:last-child) {
        border-bottom: 1px solid ${neutrals[6]};

        ${dark`
            border-color: ${neutrals[3]};
        `}
    }
`;

const CreateItem = styled.div`
    &:not(:last-child) {
        margin-bottom: 32px;
    }
`;

const CreateCategory = styled.div`
    ${bodyBold2};
`;

const CreateDescription = styled.div`
    margin-top: 4px;
    ${caption2};
    color: ${neutrals[4]};
`;

const CreateFieldset = styled.div`
    margin-top: 16px;

    & > ${Field.displayName} {
        &:not(:last-child) {
            margin-bottom: 32px;

            ${media.m`
                margin-bottom: 20px;
            `}
        }
    }
`;

const FieldRow = styled.div`
    display: flex;
    margin: 0 -10px;

    ${media.m`
        display: block;
        margin: 0;
    `}
`;

const FieldColumn = styled.div`
    flex: 0 0 calc(50% - 20px);
    width: calc(50% - 20px);
    margin: 0 10px;

    ${media.m`
        width: 100%;
        margin: 0;

        &:not(:last-child) {
            margin-bottom: 20px;
        }
    `}
`;

const CreateCollectionTextButton = styled.span`
    cursor: pointer;
    font-weight: bold;
    color: ${blue};
    transition: color 0.2s;

    &:hover {
        color: ${darken(0.1, blue)};
    }
`;

const CreateFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.m`
        display: block;
        text-align: center;
    `}

    > * {
        width: 100%;

        &:not(:last-child) {
            margin-bottom: 16px;
        }
    }
`;

export default CreateBody;
