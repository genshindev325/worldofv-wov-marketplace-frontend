import { yupResolver } from "@hookform/resolvers/yup";
import { FC, ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useTheme } from "styled-components";
import * as yup from "yup";
import AnimatedModal from "../../../modals/AnimatedModal";
import { Button } from "../../common/Button";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import { Input } from "../../FormInputs/Input";

export const url = "https://worldofv.authentic8.tech/admin/api/explore";

export type FormData = {
    nfcChip: string;
};

export type ChipValidationProps = {
    children({
        validated,
        error,
        nfcChip,
    }: {
        validated: boolean;
        error: string | null;
        nfcChip?: string;
    }): ReactElement;
};

export const ChipValidation: FC<ChipValidationProps> = ({ children }) => {
    const theme = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = yup.object().shape({
        nfcChip: yup
            .string()
            .trim()
            .required()
            .matches(
                /^0x[0-9a-fA-F]{64}$/,
                "NFC Chip can contain only lowercase, uppercase and number characters"
            ),
    });

    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
        getValues,
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        reValidateMode: "onChange",
    });

    const onSubmit = async (values: FormData) => {
        setValidated(false);
        setError(null);

        try {
            const body = new FormData();
            body.append("unit_id", values.nfcChip);

            const res = await fetch(url, { method: "POST", body });
            const json = await res.json();

            if (json.success) {
                setError("Chip ID already used.");
            } else {
                setValidated(true);
            }
        } catch (error) {
            console.warn(error);
            setError("Something went worng");
        } finally {
            setIsOpen(true);
        }
    };

    const nfcChipVal = getValues().nfcChip;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Text variant="bodyBold2" mb={2}>
                    Code verification
                </Text>
                <Flex alignItems="center" rowGap={3}>
                    <Input
                        description="Before creating a Phygital NFT, it's necessary to verify the code for the QR or NFC/RFID chip that will be associated with it. Please enter the code below to validate its legitimacy. "
                        inputProps={{
                            name: "nfcChip",
                            placeholder: "e.g. 98823123",
                            disabled: validated,
                        }}
                        register={register}
                        rightDecoration={
                            validated ? (
                                <FiCheckCircle
                                    size={20}
                                    color={theme.colors.success}
                                />
                            ) : error || errors.nfcChip ? (
                                <IoMdCloseCircleOutline
                                    size={20}
                                    color={theme.colors.error}
                                />
                            ) : null
                        }
                    />

                    <Button
                        type="submit"
                        loader={isSubmitting}
                        disabled={isSubmitting || validated}
                        style={{ alignSelf: "flex-end" }}
                    >
                        Validate
                    </Button>
                </Flex>
            </form>
            {children({
                validated,
                error,
                nfcChip: nfcChipVal,
            })}

            <AnimatedModal
                title="Code Validation"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <>
                    {validated && (
                        <Flex flexDirection="column" columnGap={5}>
                            <Text variant="bodyBold2" textAlign="center">
                                The code submitted is valid and can now be
                                utilized!
                            </Text>
                            <FiCheckCircle
                                size={128}
                                color={theme.colors.success}
                                style={{ alignSelf: "center" }}
                            />
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                Create a new Phygital
                            </Button>
                        </Flex>
                    )}
                    {error && (
                        <Flex flexDirection="column" columnGap={5}>
                            <Text variant="bodyBold2" textAlign="center">
                                Unfortunately, the code you submitted is not
                                valid.
                            </Text>
                            <IoMdCloseCircleOutline
                                size={128}
                                color={theme.colors.error}
                                style={{ alignSelf: "center" }}
                            />
                            <Text color="accent" textAlign="center">
                                Please contact the retailer of the chip in order
                                to resolve the issue
                            </Text>
                        </Flex>
                    )}
                </>
            </AnimatedModal>
        </>
    );
};
