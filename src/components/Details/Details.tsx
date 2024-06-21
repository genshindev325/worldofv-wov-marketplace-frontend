import { useBlockchain } from "@/blockchain/BlockchainProvider";
import useGraphQL from "@/hooks/useGraphQL";
import usePersistentRedirect from "@/hooks/usePersistentRedirect";
import useSocialUserData from "@/hooks/useSocialUserData";
import { useUserData, useUserDataLegacy } from "@/hooks/useUserData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import { SUPPORTED_IMAGE_MIME_TYPES } from "../../constants/upload";
import { ProfileTabs } from "../../generated/graphql";
import { useProfileValidationSchema } from "../../hooks/useProfileValidationSchema";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";
import Checkbox from "../FormInputs/Checkbox";
import { Field } from "../FormInputs/Field";
import ImageUpload from "../FormInputs/ImageUpload";
import { Input } from "../FormInputs/Input";
import { OptionItemProps, Select } from "../FormInputs/Select";
import SwitchField from "../FormInputs/SwitchField";
import { Textarea } from "../FormInputs/Textarea";
import DetailsTop from "./DetailsTop";

const { media, dark } = mixins;
const { container } = common;
const {
    colors: { neutrals },
    typography: { bodyBold2 },
} = variables;

type FormData = {
    image?: FileList;
    name: string;
    description?: string;
    email: string;
    showEmail: boolean;
    showBalance: boolean;
    isEmailNotificationEnabled?: boolean;
    landingTab: OptionItemProps<ProfileTabs>;
    url?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    discord?: string;
    instagram?: string;
    agreement?: boolean;
};

const Details = () => {
    const router = useRouter();
    const { userService, transactionService } = useBlockchain();
    const { redirectToLastSavedUrl } = usePersistentRedirect("/profile");
    const { sdk } = useGraphQL();

    const { mutate: mutateUser } = useUserData();
    const user = useUserDataLegacy();
    const { user: socialUser } = useSocialUserData();

    const {
        customUrlValidationSchema,
        imageValidationSchema,
        nameValidationSchema,
        optionalStringValidationSchema,
    } = useProfileValidationSchema();

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                name: nameValidationSchema,
                image: imageValidationSchema,
                description: optionalStringValidationSchema,
                email: yup.string().email().required(),
                showEmail: yup.boolean().nullable(),
                showBalance: yup.boolean().nullable(),
                isEmailNotificationEnabled: yup.boolean().nullable(),
                landingTab: yup.mixed().nullable(),
                url: customUrlValidationSchema,
                website: optionalStringValidationSchema.url(),
                facebook: optionalStringValidationSchema.url(),
                twitter: optionalStringValidationSchema.url(),
                discord: optionalStringValidationSchema.url(),
                instagram: optionalStringValidationSchema.url(),
                agreement: yup.boolean().isTrue(),
            }),
        [
            customUrlValidationSchema,
            imageValidationSchema,
            nameValidationSchema,
            optionalStringValidationSchema,
        ]
    );

    const landingTabOptions = useMemo(
        () => [
            { label: "Created", value: ProfileTabs.Created },
            { label: "On Sale", value: ProfileTabs.OnSale },
            { label: "Auctions", value: ProfileTabs.OnAuction },
            { label: "Collected", value: ProfileTabs.Collected },
            { label: "Collection", value: ProfileTabs.Collections },
        ],
        []
    );

    const defaultValues = useMemo(
        () =>
            user
                ? {
                      landingTab: landingTabOptions.find(
                          (el) => el.value === user.landingTab
                      ),
                      showBalance: user.showBalance,
                      showEmail: user.showEmail,
                      isEmailNotificationEnabled:
                          user.isEmailNotificationEnabled,
                      name: user.name,
                      description: user.description,
                      email: user.email,
                      url: user.customUrl,
                      website: user.websiteUrl,
                      facebook: user.facebookUrl,
                      twitter: user.twitterUrl,
                      discord: user.discordUrl,
                      instagram: user.instagramUrl,
                  }
                : undefined,
        [landingTabOptions, user]
    );

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, isValid, errors },
        setValue,
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues,
        mode: "all",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (socialUser?.email && !user?.email) {
            setValue("email", socialUser.email);
        }
    }, [setValue, socialUser?.email, user?.email]);

    useEffect(() => {
        if (!user) router.replace("/");
    });

    if (!user) {
        return null;
    }

    const onSubmit = async (values: FormData) => {
        let toastID: any;

        try {
            // User name needs to be updated on the blockchain.
            if (values.name !== user.name) {
                const clause = user.profileId
                    ? await userService!.updateUser(values.name, user.profileId)
                    : await userService!.registerUser(values.name);

                await transactionService!.runTransaction({
                    clauses: [clause],
                    comment: `Set profile name to '${values.name}'`,
                });
            }

            toastID = toast.loading("Updating profile data…");

            const res = await sdk.UpdateUser({
                email: values.email,
                description: values.description || "",
                customUrl: values.url || "",
                websiteUrl: values.website || "",
                facebookUrl: values.facebook || "",
                twitterUrl: values.twitter || "",
                discordUrl: values.discord || "",
                instagramUrl: values.instagram || "",
                landingTab: values.landingTab?.value,
                showEmail: !!values.showEmail,
                showBalance: !!values.showBalance,
                isEmailNotificationEnabled: !!values.isEmailNotificationEnabled,
                profileImage: values.image?.[0],
            });

            mutateUser({ user: res.user });

            toast.update(toastID, {
                render: "You've updated your account!",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
            });

            redirectToLastSavedUrl();
        } catch (error: any) {
            console.warn(error);

            let errorMsg =
                error?.response?.errors?.[0]?.message ||
                "An error occurred while processing your request";

            if (
                errorMsg.includes("Unique constraint failed on the fields") &&
                errorMsg.includes("email")
            ) {
                errorMsg = "Email already registered";
            }

            if (toastID) {
                toast.update(toastID, {
                    render: errorMsg,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                    closeButton: true,
                    closeOnClick: true,
                });
            }
        }
    };

    return (
        <Container>
            <DetailsTop />

            <form onSubmit={handleSubmit(onSubmit)}>
                <DetailsRow>
                    <DetailsColumn>
                        <DetailsItem>
                            <DetailsCategory>Account Details</DetailsCategory>

                            <DetailsFieldset>
                                <ImageUpload
                                    register={register}
                                    errors={errors}
                                    label="Profile photo"
                                    description="We recommend an image of at least 400x400 and max 1MB."
                                    imageSrc={user.profileImage}
                                    inputProps={{
                                        name: "image",
                                        accept: SUPPORTED_IMAGE_MIME_TYPES.join(
                                            ","
                                        ),
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Display Name*"
                                    inputProps={{
                                        name: "name",
                                        placeholder: "Enter your display name",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Email*"
                                    inputProps={{
                                        name: "email",
                                        type: "email",
                                        placeholder: "example@mail.com",
                                    }}
                                />

                                <Textarea
                                    register={register}
                                    errors={errors}
                                    label="Description"
                                    inputProps={{
                                        name: "description",
                                        placeholder:
                                            "About yourself in a few words",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Custom URL"
                                    inputProps={{
                                        name: "url",
                                        prefix: process.browser
                                            ? `${window.location.host}/profile/`
                                            : "profile/",
                                        placeholder: "custom",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Website"
                                    inputProps={{
                                        name: "website",
                                        placeholder: "Enter URL",
                                    }}
                                />
                            </DetailsFieldset>
                        </DetailsItem>
                    </DetailsColumn>

                    <DetailsColumn>
                        <DetailsItem>
                            <DetailsCategory>Social</DetailsCategory>

                            <DetailsFieldset>
                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Facebook"
                                    inputProps={{
                                        name: "facebook",
                                        placeholder: "https://facebook.com/…",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Twitter"
                                    inputProps={{
                                        name: "twitter",
                                        placeholder: "https:/twitter.com/…",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Discord"
                                    inputProps={{
                                        name: "discord",
                                        placeholder:
                                            "https://discord.com/users/…",
                                    }}
                                />

                                <Input
                                    register={register}
                                    errors={errors}
                                    label="Instagram"
                                    inputProps={{
                                        name: "instagram",
                                        placeholder: "https://instagram.com/…",
                                    }}
                                />
                            </DetailsFieldset>
                        </DetailsItem>

                        <DetailsItem>
                            <DetailsCategory>Preferences</DetailsCategory>

                            <SwitchField
                                register={register}
                                errors={errors}
                                label="Show balance"
                                description="Enabling this option will make your WoV, VET and vVET balance public on your profile."
                                inputProps={{
                                    name: "showBalance",
                                }}
                            />

                            <SwitchField
                                register={register}
                                errors={errors}
                                label="Show email"
                                description="Enabling this option will make your email public on your profile."
                                inputProps={{
                                    name: "showEmail",
                                }}
                            />

                            <SwitchField
                                register={register}
                                errors={errors}
                                label="Offers / Bids"
                                description="Enabling this option you’ll receive email updates on offers and bids received on your NFTs."
                                inputProps={{
                                    name: "isEmailNotificationEnabled",
                                }}
                            />

                            <DetailsFieldset>
                                <Select
                                    register={register}
                                    errors={errors}
                                    label="Landing Tab"
                                    inputProps={{
                                        name: "landingTab",
                                        options: landingTabOptions,
                                    }}
                                />
                            </DetailsFieldset>
                        </DetailsItem>

                        <DetailsItem>
                            <DetailsCategory>
                                Terms and Conditions
                            </DetailsCategory>

                            <Checkbox
                                register={register}
                                errors={errors}
                                inputProps={{
                                    name: "agreement",
                                    defaultChecked: true,
                                }}
                            >
                                By signing up I confirm that I have read,
                                consent and agree to World of V&apos;s{" "}
                                <a href="/terms.pdf" target="_blank">
                                    Terms and Conditions
                                </a>{" "}
                                and I am of legal age.
                            </Checkbox>
                        </DetailsItem>

                        <DetailsNote>
                            To update your profile it may be necessary to sign a
                            message through your wallet.
                        </DetailsNote>

                        <DetailsNote style={{ marginTop: 4 }}>
                            Click <strong>Update profile</strong> then sign the
                            message if necessary.
                        </DetailsNote>

                        <DetailsButtons>
                            <Button
                                type="submit"
                                loader={isSubmitting}
                                disabled={!isValid || isSubmitting}
                            >
                                Update Profile
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
            </form>
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

    ${media.m`
        display: block;
        margin: 0;
    `}
`;

const DetailsColumn = styled.div`
    flex: 0 0 calc(50% - 32px);
    width: calc(50% - 32px);
    margin: 0 16px;

    ${media.m`
        width: 100%;
        margin: 0;
    `}

    &:not(:last-child) {
        ${media.m`
            margin-bottom: 32px;
            border-bottom: 1px solid ${neutrals[6]};

            ${dark`
                border-color: ${neutrals[3]};
            `}
        `}
    }
`;

const DetailsItem = styled.div`
    ${media.m`
    flex: 0 0 calc(50% - 40px);
        width: 100%;
        margin: 0;
    `}

    &:not(:last-child) {
        margin-bottom: 32px;

        ${media.m`
            margin-bottom: 32px;
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

const DetailsNote = styled.div`
    color: ${neutrals[4]};

    strong {
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}
    }
`;

const DetailsButtons = styled.div`
    display: flex;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid ${neutrals[6]};

    ${media.m`
        display: block;
        text-align: center;
    `}

    ${dark`
        border-color: ${neutrals[3]};
    `}

    ${Button.displayName} {
        margin-top: 16px;
        ${media.m`
            width: 100%;
        `}

        &:not(:last-child) {
            margin-right: 16px;
        }
    }
`;

export default Details;
