import { useBlockchain } from "@/blockchain/BlockchainProvider";
import useGraphQL from "@/hooks/useGraphQL";
import { useUserDataLegacy } from "@/hooks/useUserData";
import AnimatedModal from "@/modals/AnimatedModal";
import { useMediaQuery } from "@react-hook/media-query";
import _, { capitalize } from "lodash";
import { useRouter } from "next/router";
import { darken } from "polished";
import { useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import * as yup from "yup";
import CATEGORIES from "../../constants/categories";
import {
    BATCH_MINT_MAX_FILE_SIZE_BYTES,
    BATCH_MINT_MAX_TOKEN_COUNT,
    SINGLE_MINT_MAX_FILE_SIZE_BYTES,
    SUPPORTED_MIME_TYPES,
} from "../../constants/upload";
import { QueryGetUserCollections } from "../../graphql/get-user-collections.graphql";
import { MutationUpsertCollection } from "../../graphql/upsert-collection.graphql";
import { useDropzone } from "../../hooks/useDropzone";
import ModalFastCreateCollection from "../../modals/ModalFastCreateCollection";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { CollectionInfo } from "../BatchCreate/BatchCreateContext";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { useConnex } from "../ConnexProvider";
import { useCreate } from "../Create/CreateProvider";
import CreateUploadFile from "../Create/CreateUploadFile";
import FlatLoader from "../FlatLoader";
import Checkbox from "../FormInputs/Checkbox";
import { Field } from "../FormInputs/Field";
import Form from "../FormInputs/Form";
import { Input } from "../FormInputs/Input";
import { OptionItemProps, Select } from "../FormInputs/Select";
import Slider from "../FormInputs/Slider";
import SwitchField from "../FormInputs/SwitchField";
import { Textarea } from "../FormInputs/Textarea";
import Link from "../Link";
import MediaDropzone from "../MediaDropzone";
import Preview from "../Preview/Preview";
import ReCaptchaBanner from "../ReCaptchaBanner";
import { ChipValidation } from "./ChipValidation";
import { ExtraAttributes, Trait } from "./ExtraAttributes";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { bodyBold2, caption2 },
    breakpoints,
} = variables;

export type FormData = {
    file: File;
    nfcChip: string;
    name: string;
    description?: string;
    royalty?: number;
    categories?: OptionItemProps[];
    trait_artist?: string;
    trait_artwork?: string;
    trait_brand?: string;
    trait_model?: string;
    trait_creationDate?: string;
    trait_location?: string;
    trait_material?: string;
    trait_dimension?: string;
    trait_size?: string;
    trait_color?: string;
    trait_edition?: string;
    trait_medium?: string;
    hasExtraFiles: boolean;
    isCollectionEnabled: boolean;
    collection?: OptionItemProps;
};

type InputProps = { label: string; inputProps: Record<string, any> };

const RAW_TRAIT_FIELDS: InputProps[] = [
    { label: "Artist", inputProps: { name: "trait_artist" } },
    { label: "Artwork", inputProps: { name: "trait_artwork" } },
    { label: "Brand", inputProps: { name: "trait_brand" } },
    { label: "Model", inputProps: { name: "trait_model" } },
    {
        label: "Creation date",
        inputProps: {
            type: "date",
            name: "trait_creationDate",
            style: { minHeight: "48px" },
        },
    },
    { label: "Location", inputProps: { name: "trait_location" } },
    { label: "Material", inputProps: { name: "trait_material" } },
    { label: "Dimension", inputProps: { name: "trait_dimension" } },
    { label: "Size", inputProps: { name: "trait_size" } },
    { label: "Color", inputProps: { name: "trait_color" } },
    { label: "Edition", inputProps: { name: "trait_edition" } },
    { label: "Medium", inputProps: { name: "trait_medium" } },
];

// Group items in pairs for better display
function groupItems<T>(items: T[]): T[][] {
    const res: T[][] = [];

    items.forEach((item, idx) => {
        if (idx % 2 === 0) {
            res.push([item]);
        } else {
            res[res.length - 1].push(item);
        }
    });

    return res;
}

const TRAIT_FIELDS: InputProps[][] = groupItems<InputProps>(RAW_TRAIT_FIELDS);

const maxFileSizeMiB = SINGLE_MINT_MAX_FILE_SIZE_BYTES / 1024 / 1024;

const CreateBody = () => {
    const router = useRouter();
    const user = useUserDataLegacy();
    const { client, sdk } = useGraphQL();

    const { setFormValues, formValues } = useCreate();
    const { mintToken } = useConnex();
    const { transactionService } = useBlockchain();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const {
        files: extraFiles,
        handleDrop,
        handleRemove,
        handleClear,
    } = useDropzone();

    const [isCollectionCreateOpen, setIsCollectionCreateOpen] = useState(false);
    const [extraTraits, setExtraTraits] = useState<Trait[]>([]);
    const [isExtraTraitsModalOpen, setExtraTraitsModalOpen] = useState(false);
    const [txModalOpen, setTxModalOpen] = useState(false);

    const { data, mutate } = useSWR(
        [QueryGetUserCollections, { userAddress: user?.address }],
        (data, vars) => client.request(data, vars)
    );

    const validationSchema = yup.object().shape({
        file: yup.mixed().required(),
        nfcChip: yup.string().required(),
        name: yup.string().required(),
        description: yup.string(),
        royalty: yup.number(),
        categories: yup.array(),
        trait_artist: yup.string(),
        trait_artwork: yup.string(),
        trait_brand: yup.string(),
        trait_model: yup.string(),
        trait_creationDate: yup.string(),
        trait_location: yup.string(),
        trait_material: yup.string(),
        trait_dimension: yup.string(),
        trait_size: yup.string(),
        trait_color: yup.string(),
        trait_edition: yup.string(),
        trait_medium: yup.string(),
        hasExtraFiles: yup.boolean(),
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

        const categories = (values.categories || []).map(({ value }) => value);
        categories.push("phygital"); // Phygital should always be present

        const attributes: Trait[] = Object.entries(values)
            .filter(
                ([key, value]) =>
                    key.startsWith("trait_") &&
                    value != null &&
                    (typeof value === "string" ? value.trim().length > 0 : true)
            )
            .map(([key, value]) => {
                const k = key.replace("trait_", "");

                const trait: {
                    trait_type: string;
                    value: any;
                    display_type?: string;
                } = {
                    trait_type: capitalize(k),
                    value,
                };

                if (k === "creationDate") {
                    trait["display_type"] = "date";
                    const date = new Date(value as string);
                    const milliseconds = date.getTime();
                    trait.value = milliseconds;
                }

                return trait;
            });

        // Add nfcChip attribute
        attributes.push({ trait_type: "NFC-Chip", value: values.nfcChip });

        // Append custom attributes
        extraTraits.forEach((t) => {
            attributes.push(t);
        });

        try {
            // Upload extra files to IPFS and add them to the attributes array
            if (
                values.hasExtraFiles &&
                extraFiles != null &&
                extraFiles.length > 0
            ) {
                for (const [i, image] of Object.entries(extraFiles)) {
                    const captchaToken = await executeRecaptcha!("pin_image");

                    const { txId } = await sdk.PinImageToArweave(
                        { image },
                        { "g-recaptcha-response": captchaToken }
                    );

                    attributes.push({
                        trait_type: `Media-${i + 1}`,
                        value: `https://arweave.net/${txId}`,
                    });
                }
            }

            const captchaToken = await executeRecaptcha!("pin_metadata");

            const { data } = await sdk.PinMetadataToArweave(
                {
                    image: values.file,
                    name: values.name,
                    description: values.description,
                    categories: categories,
                    collectionName: values.collection?.label,
                    attributes,
                },
                { "g-recaptcha-response": captchaToken }
            );

            const res = await mintToken({
                metadataHash: data.metadataTxId,
                fileHash: data.imageTxId,
                editionsCount: 1,
                royalty: values.royalty,
                tokenName: values.name,
                collectionName: values.collection?.label,
            });

            setTxModalOpen(true);

            const [event] = await transactionService!.checkTransaction({
                txID: res.txid,
                eventNames: ["woviesCreation"],
            });

            router.push(
                `/token/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}/${event.returnValues.woviesId}`
            );
        } catch (error) {
            console.warn(error);
        } finally {
            setTxModalOpen(false);
        }
    };

    return (
        <Container>
            <ChipValidation>
                {({ validated, error, nfcChip }) => {
                    if (!validated || error != null) return <div />;

                    return (
                        <>
                            <Form<FormData>
                                {...{ onSubmit, validationSchema }}
                                render={({
                                    formState: { isSubmitting },
                                    watch,
                                    control,
                                }) => {
                                    const isCollectionEnabled = watch(
                                        "isCollectionEnabled"
                                    );
                                    const showExtraFiles =
                                        watch("hasExtraFiles");

                                    // TODO: switch to the `useForm` hook and implement this
                                    // properly.
                                    const values: any = watch();
                                    values.isMultipleEditions = false;
                                    if (!_.isEqual(formValues, values)) {
                                        setFormValues(values);
                                    }

                                    return (
                                        <>
                                            <CreateList>
                                                <CreateItem>
                                                    <Input
                                                        inputProps={{
                                                            type: "hidden",
                                                            name: "nfcChip",
                                                            value: nfcChip,
                                                        }}
                                                    />

                                                    <CreateCategory>
                                                        NFT Details
                                                    </CreateCategory>

                                                    <CreateFieldset>
                                                        <Input
                                                            label="Item name *"
                                                            inputProps={{
                                                                name: "name",
                                                                placeholder:
                                                                    "e.g. “Awesome NFT",
                                                            }}
                                                        />

                                                        <Controller
                                                            name={"file"}
                                                            control={control}
                                                            render={({
                                                                field: {
                                                                    onChange,
                                                                },
                                                            }) => (
                                                                <CreateUploadFile
                                                                    onChange={
                                                                        onChange
                                                                    }
                                                                    accept={
                                                                        SUPPORTED_MIME_TYPES
                                                                    }
                                                                    maxSize={
                                                                        SINGLE_MINT_MAX_FILE_SIZE_BYTES
                                                                    }
                                                                />
                                                            )}
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
                                                                    label="Categories *"
                                                                    inputProps={{
                                                                        name: "categories",
                                                                        placeholder:
                                                                            "Select one or more category",
                                                                        options:
                                                                            categoriesOptions,
                                                                        isMulti:
                                                                            true,
                                                                    }}
                                                                />
                                                            </FieldColumn>
                                                        </FieldRow>
                                                    </CreateFieldset>
                                                </CreateItem>
                                            </CreateList>

                                            <CreateList>
                                                <CreateItem>
                                                    <CreateCategory>
                                                        Physical - Provenance
                                                        details
                                                    </CreateCategory>
                                                    <Text
                                                        variant="caption2"
                                                        color="neutral"
                                                        mt={1}
                                                    >
                                                        Add information about
                                                        your physical item
                                                    </Text>

                                                    <CreateFieldset>
                                                        {TRAIT_FIELDS.map(
                                                            (traits) => (
                                                                <Flex
                                                                    key={
                                                                        traits[0]
                                                                            .label
                                                                    }
                                                                    flexDirection={{
                                                                        _: "column",
                                                                        m: "row",
                                                                    }}
                                                                    rowGap={{
                                                                        _: 0,
                                                                        m: 3,
                                                                    }}
                                                                    columnGap={{
                                                                        _: 3,
                                                                        m: 0,
                                                                    }}
                                                                >
                                                                    {traits.map(
                                                                        ({
                                                                            label,
                                                                            inputProps,
                                                                        }) => (
                                                                            <Input
                                                                                key={
                                                                                    label
                                                                                }
                                                                                label={
                                                                                    label
                                                                                }
                                                                                inputProps={
                                                                                    inputProps
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                </Flex>
                                                            )
                                                        )}
                                                        {groupItems<Trait>(
                                                            extraTraits
                                                        ).map((traits) => (
                                                            <Flex
                                                                key={
                                                                    traits[0]
                                                                        .trait_type
                                                                }
                                                                flexDirection={{
                                                                    _: "column",
                                                                    m: "row",
                                                                }}
                                                                rowGap={{
                                                                    _: 0,
                                                                    m: 3,
                                                                }}
                                                                columnGap={{
                                                                    _: 3,
                                                                    m: 0,
                                                                }}
                                                            >
                                                                {traits.map(
                                                                    ({
                                                                        trait_type,
                                                                        value,
                                                                    }) => (
                                                                        <Input
                                                                            key={
                                                                                trait_type
                                                                            }
                                                                            label={
                                                                                trait_type
                                                                            }
                                                                            inputProps={{
                                                                                defaultValue:
                                                                                    value,
                                                                                readOnly:
                                                                                    true,
                                                                            }}
                                                                        />
                                                                    )
                                                                )}
                                                            </Flex>
                                                        ))}
                                                    </CreateFieldset>
                                                    <Spacer y size={4} />
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setExtraTraitsModalOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Add more{" "}
                                                        {extraTraits.length >
                                                            0 && "/ edit"}
                                                    </Button>
                                                </CreateItem>
                                            </CreateList>

                                            <CreateList>
                                                <CreateItem>
                                                    <Flex rowGap={2}>
                                                        <CreateCategory>
                                                            <Text
                                                                variant="caption2"
                                                                color="neutral"
                                                                fontWeight="bold"
                                                            >
                                                                MORE IMAGES OR
                                                                VIDEOS?
                                                            </Text>
                                                        </CreateCategory>

                                                        <Checkbox
                                                            inputProps={{
                                                                name: "hasExtraFiles",
                                                                defaultChecked:
                                                                    false,
                                                            }}
                                                        />
                                                    </Flex>
                                                </CreateItem>

                                                {showExtraFiles && (
                                                    <>
                                                        <CreateCategory>
                                                            Upload photos and
                                                            videos of the
                                                            physical item
                                                        </CreateCategory>
                                                        <Text
                                                            variant="caption2"
                                                            color="neutral"
                                                            mt={1}
                                                            mb={3}
                                                        >
                                                            Drag or choose your
                                                            files to upload
                                                        </Text>
                                                        <MediaDropzone
                                                            supportedMimeTypes={
                                                                SUPPORTED_MIME_TYPES
                                                            }
                                                            maxFileCount={
                                                                BATCH_MINT_MAX_TOKEN_COUNT
                                                            }
                                                            maxFileSizeBytes={
                                                                BATCH_MINT_MAX_FILE_SIZE_BYTES
                                                            }
                                                            files={extraFiles}
                                                            onDrop={handleDrop}
                                                            onRemove={
                                                                handleRemove
                                                            }
                                                            onClear={
                                                                handleClear
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </CreateList>

                                            <CreateList>
                                                <SwitchField
                                                    label="Collection"
                                                    description="Enable this option if you want to add this NFT to a collection"
                                                    inputProps={{
                                                        name: "isCollectionEnabled",
                                                    }}
                                                />

                                                {isCollectionEnabled && (
                                                    <>
                                                        <Select
                                                            label="Collection Name"
                                                            inputProps={{
                                                                name: "collection",
                                                                placeholder:
                                                                    "Select a collection",
                                                                options:
                                                                    collectionOptions,
                                                                menuPlacement:
                                                                    "top",
                                                            }}
                                                        />

                                                        <CreateDescription>
                                                            Did you forget to
                                                            create the
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
                                                                    To be able
                                                                    to mint
                                                                    please{" "}
                                                                    <Link
                                                                        href="/profile/edit"
                                                                        passHref
                                                                    >
                                                                        <a>
                                                                            update
                                                                            your
                                                                            profile
                                                                        </a>
                                                                    </Link>{" "}
                                                                    details
                                                                </>
                                                            )
                                                        }
                                                    />
                                                )}

                                                {showPreview && (
                                                    <Flex
                                                        justifyContent="center"
                                                        pb={4}
                                                    >
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
                                                        !transactionService ||
                                                        !executeRecaptcha
                                                    }
                                                >
                                                    Create Phygital
                                                </Button>

                                                <ReCaptchaBanner />
                                            </CreateFooter>
                                        </>
                                    );
                                }}
                            />
                            <AnimatedModal
                                title="Add properties"
                                isOpen={isExtraTraitsModalOpen}
                                setIsOpen={setExtraTraitsModalOpen}
                            >
                                <ExtraAttributes
                                    traits={extraTraits}
                                    onSubmit={(t) => {
                                        setExtraTraits(t);
                                        setExtraTraitsModalOpen(false);
                                    }}
                                />
                            </AnimatedModal>
                            <AnimatedModal
                                isOpen={txModalOpen}
                                setIsOpen={setTxModalOpen}
                            >
                                <Flex
                                    flexDirection="column"
                                    alignItems="center"
                                    columnGap={5}
                                    mt={5}
                                >
                                    <FlatLoader size={150} />
                                    <Text
                                        variant="bodyBold1"
                                        textAlign="center"
                                    >
                                        The transaction is on the way
                                    </Text>
                                    <Text>
                                        Wait just a few moments for the
                                        transaction to be confirmed
                                    </Text>
                                </Flex>
                            </AnimatedModal>
                        </>
                    );
                }}
            </ChipValidation>

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
