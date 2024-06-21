import { useBlockchain } from "@/blockchain/BlockchainProvider";
import Link from "@/components/Link";
import useGraphQL from "@/hooks/useGraphQL";
import useSocialUserData from "@/hooks/useSocialUserData";
import { useUserData } from "@/hooks/useUserData";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmail } from "class-validator";
import { omit } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useProfileValidationSchema } from "../../../hooks/useProfileValidationSchema";
import { Button } from "../../common/Button";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import FlatLoader from "../../FlatLoader";
import { Input } from "../../FormInputs/Input";
import { Select } from "../../FormInputs/Select";
import { VerificationInput } from "../../FormInputs/VerificarionInput";
import ReCaptchaBanner from "../../ReCaptchaBanner";
import { Countdown } from "../Countdown";

const COUNTDOWN_DURATION = 20;
const CODELESS = "codeless";

export interface FormValues {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    selectedOption?: string;
    code: string;
    twitter?: string;
    birthDate?: string;
}

export type Option = { label: string; id: string };

export type RegistrationFormProps = {
    pointsContractAddress: string;
    isPOAToken?: boolean;
    clientId: string;
    optionsLabel?: string;
    selectOptions?: Option[];
    verificationInputDescription?: string | React.ReactNode;
    onSubmit?: (data: FormValues) => void;
    codeLength?: number;
    validChars?: string;
    showTwitter?: boolean;
    showBirthDate?: boolean;
};

export function RegistrationForm({
    pointsContractAddress,
    clientId,
    optionsLabel = "Pick your favorite option",
    selectOptions,
    verificationInputDescription = "Please type the secret code you received",
    onSubmit = () => {},
    codeLength = 6,
    validChars = "0-9",
    showTwitter = false,
    showBirthDate = false,
}: RegistrationFormProps) {
    const { transactionService, userService, nftService, walletService } =
        useBlockchain();
    const { t } = useTranslation();
    const { sdk } = useGraphQL();

    const { user, mutate: mutateUser } = useUserData();
    const { user: socialUser } = useSocialUserData();

    const [disabled, setDisabled] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdownEnded, setCountdownEnded] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const { nameValidationSchema } = useProfileValidationSchema();
    const validationSchema = useMemo(
        () =>
            yup.object({
                firstName: yup
                    .string()
                    .required(t("common:required_field") || "Required"),
                lastName: yup
                    .string()
                    .required(t("common:required_field") || "Required"),
                name: nameValidationSchema, // TODO
                email: yup
                    .string()
                    .email(t("common:email_field_valid") || "Required")
                    .required(t("common:required_field") || "Required"),
                twitter: yup.string().notRequired(),
                birthDate: yup.string().notRequired(),
                selectedOption: yup.string().when([], {
                    is: () => selectOptions != null && selectOptions.length > 0,
                    then: yup
                        .string()
                        .required(t("common:required_field") || "Required"),
                    otherwise: yup.string().notRequired(),
                }),
                code: yup.string().when([], {
                    is: () => clientId === CODELESS,
                    then: yup.string().notRequired(),
                    otherwise: yup
                        .string()
                        .test(
                            "len",
                            `Must be exactly ${codeLength} characters`,
                            (val) => val?.length === codeLength
                        ),
                }),
            }),
        [t, nameValidationSchema, codeLength, selectOptions, clientId]
    );

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        setError,
        trigger,
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        reValidateMode: "onChange",
    });

    useEffect(() => {
        const email = user?.email || socialUser?.email;
        const name = user?.name || socialUser?.name;
        const firstName = user?.firstName || socialUser?.firstName;
        const lastName = user?.lastName || socialUser?.lastName;

        if (email) setValue("email", email);
        if (name && !isEmail(name)) setValue("name", name);
        if (firstName && !isEmail(firstName)) setValue("firstName", firstName);
        if (lastName) setValue("lastName", lastName);
    }, [setValue, socialUser, user]);

    const submitHandler = async (data: FormValues) => {
        setDisabled(true);

        try {
            if (user == null) throw new Error("User is not connected");

            await sdk.CheckSecretCode({
                clientId,
                secretCode:
                    clientId === CODELESS ? "000000" : data.code.toUpperCase(),
            });

            if (user?.email == null) {
                const { user: existingUser } = await sdk.GetUser({
                    email: data.email,
                });

                if (existingUser != null) {
                    throw new Error("Email already registered");
                }
            }

            const clauses: Connex.VM.Clause[] = [];

            if (!user.profileId) {
                const clause = await userService!.registerUser(data.name);
                clauses.push(clause);
            }

            clauses.push(
                await nftService!.mintRandomToken(pointsContractAddress)
            );

            const tx = await walletService!.signTransaction({
                clauses,
                comment:
                    t("business_claim:registration_form.tx_comment") ||
                    "Claim your NFT",
            });

            setShowCountdown(true);

            await transactionService!.checkTransaction({
                txID: tx.txid,
                eventNames: ["Transfer"],
            });

            // This has to go last because because it depends on
            // the user instance being present.
            const res = await sdk.UpdateUser({
                email: data.email,
                twitterUrl: data.twitter,
                firstName: data.firstName,
                lastName: data.lastName,
            });

            const captchaToken = await executeRecaptcha!("claim");

            await sdk.ConsumeSecretCode(
                {
                    clientId,
                    secretCode:
                        clientId === CODELESS
                            ? "000000"
                            : data.code.toUpperCase(),
                    metadata: omit(
                        {
                            ...data,
                            account: user.address,
                            profileId: user?.profileId,
                        },
                        "code"
                    ),
                },
                { "g-recaptcha-response": captchaToken }
            );

            await mutateUser({ user: res.user });
        } catch (error: any) {
            console.warn(error);

            let errorMsg =
                error?.response?.errors?.[0]?.message ||
                error?.message ||
                "An error occurred while processing your request";

            if (
                (errorMsg.includes("Unique constraint failed on the fields") &&
                    errorMsg.includes("email")) ||
                errorMsg.includes("Email already registered")
            ) {
                errorMsg = t(
                    "business_claim:registration_form.errors.existing_email"
                );
                setError("email", { message: errorMsg });
            } else if (errorMsg.includes("Secret code not found")) {
                errorMsg = t(
                    "business_claim:registration_form.errors.wrong_code"
                );
                setError("code", { message: errorMsg });
            } else if (
                errorMsg.includes("Code was already used to perform a claim")
            ) {
                errorMsg = t(
                    "business_claim:registration_form.errors.used_code"
                );
                setError("code", { message: errorMsg });
            }

            toast.error(errorMsg);
            return;
        } finally {
            setDisabled(false);
            setShowCountdown(false);
        }

        onSubmit(data);
    };

    if (showCountdown) {
        return (
            <Flex
                flexDirection="column"
                alignItems="center"
                columnGap={5}
                mt={5}
            >
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    height={150}
                >
                    {countdownEnded ? (
                        <FlatLoader size={150} />
                    ) : (
                        <Countdown
                            size={150}
                            duration={COUNTDOWN_DURATION}
                            onComplete={() => {
                                setCountdownEnded(true);
                            }}
                        />
                    )}
                </Flex>
                <Text variant="bodyBold1" textAlign="center">
                    {t("business_claim:minting_modal.title")}
                </Text>
                <Text>{t("business_claim:minting_modal.subtitle")}</Text>
            </Flex>
        );
    }

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <Flex flexDirection="column" columnGap={4}>
                {(user?.firstName == null ||
                    user?.lastName == null ||
                    user?.name == null ||
                    user?.email == null) && (
                    <Text variant="body2" color="accent">
                        <Text>
                            {t("business_claim:registration_form.title")}
                        </Text>
                    </Text>
                )}
                {(user?.firstName == null || user?.lastName == null) && (
                    <Flex rowGap={3}>
                        {user?.firstName == null && (
                            <Input
                                label={
                                    t(
                                        "business_claim:registration_form.first_name_input_label"
                                    ) || "First name"
                                }
                                inputProps={{
                                    name: "firstName",
                                    placeholder:
                                        t(
                                            "business_claim:registration_form.first_name_input_placeholder"
                                        ) || "e.g. John",
                                    disabled: !!socialUser?.firstName,
                                }}
                                register={register}
                                errors={errors}
                            />
                        )}
                        {user?.lastName == null && (
                            <Input
                                label={
                                    t(
                                        "business_claim:registration_form.last_name_input_label"
                                    ) || "Surname"
                                }
                                inputProps={{
                                    name: "lastName",
                                    placeholder:
                                        t(
                                            "business_claim:registration_form.last_name_input_placeholder"
                                        ) || "e.g. Smith",
                                    disabled: !!socialUser?.lastName,
                                }}
                                register={register}
                                errors={errors}
                            />
                        )}
                    </Flex>
                )}
                {user?.name == null && (
                    <Input
                        label={
                            t(
                                "business_claim:registration_form.nickname_input_label"
                            ) || "Display name"
                        }
                        inputProps={{
                            name: "name",
                            // placeholder: "e.g. Smith",
                            // defaultValue: "qwe",
                        }}
                        register={register}
                        errors={errors}
                    />
                )}
                {user?.email == null && (
                    <Input
                        label={
                            t(
                                "business_claim:registration_form.email_input_label"
                            ) || "Email address"
                        }
                        inputProps={{
                            name: "email",
                            placeholder: "e.g. email@gmail.com",
                            // defaultValue: "email@gmail.com",
                        }}
                        register={register}
                        errors={errors}
                    />
                )}
                {showTwitter && (
                    <Input
                        label="Enter your Twitter Account"
                        inputProps={{
                            name: "twitter",
                            placeholder: "@Username",
                        }}
                        register={register}
                        errors={errors}
                    />
                )}
                {showBirthDate && (
                    <Input
                        label="Date of Birth"
                        inputProps={{
                            name: "birthDate",
                            // placeholder: "",
                            type: "date",
                        }}
                        register={register}
                        errors={errors}
                    />
                )}
                {selectOptions != null && selectOptions.length > 0 && (
                    <Select
                        label={optionsLabel}
                        inputProps={{
                            options: selectOptions,
                            ...register("selectedOption"),
                            onChange: (o: Option) => {
                                setValue("selectedOption", o.id);
                                trigger("selectedOption");
                            },
                        }}
                        errors={errors}
                    />
                )}
                {clientId !== CODELESS && (
                    <VerificationInput
                        label="Secret code"
                        description={verificationInputDescription}
                        inputProps={{ name: "code" }}
                        register={register}
                        errors={errors}
                        length={codeLength}
                        validChars={validChars}
                    />
                )}
                <Button
                    type="submit"
                    loader={!executeRecaptcha || disabled}
                    disabled={disabled}
                >
                    {t("business_claim:registration_form.submit_button_label")}
                </Button>

                <Flex flexDirection="column" columnGap={2}>
                    <ReCaptchaBanner />

                    <Text variant="caption2" color="accent" textAlign="center">
                        {t("business_claim:registration_form.you_agree_to")}{" "}
                        <b>
                            <Link href="/privacy" passHref>
                                {t(
                                    "business_claim:registration_form.privacy_policy"
                                )}
                            </Link>
                        </b>
                        .
                    </Text>
                </Flex>
            </Flex>
        </form>
    );
}
