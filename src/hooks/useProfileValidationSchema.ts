import { useBlockchain } from "@/blockchain/BlockchainProvider";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import * as yup from "yup";
import {
    PROFILE_MAX_FILE_SIZE_BYTES,
    SUPPORTED_IMAGE_MIME_TYPES,
} from "../constants/upload";
import isSupportedFormat from "../utils/isSupportedFormat";
import { useUserData } from "./useUserData";

export function useProfileValidationSchema() {
    const { userService } = useBlockchain();
    const { user } = useUserData();
    const { t } = useTranslation();

    const nameValidationSchema = useMemo(() => {
        const checkName = async (resolve: any, value?: string) => {
            if (value && user && value !== user!.name) {
                try {
                    const res = await userService!.isUsernameAlreadyInUse(
                        value
                    );
                    resolve(!res);
                } catch {
                    resolve(false);
                }
            } else {
                resolve(true);
            }
        };

        const debouncedCheckName = _.debounce(checkName, 250);

        return yup
            .string()
            .trim()
            .required(t("common:required_field") || "Required")
            .max(
                25,
                t("common:name_field_max_length", { length: 25 }) ||
                    "Name cannot be longer than 25 characters"
            )
            .matches(
                /^[a-zA-Z0-9\s]*$/,
                t("common:name_field_allowed_chars") ||
                    "Name can contain only lowercase, uppercase and number characters"
            )
            .test(
                "isAlreadyInUse",
                t("common:name_field_already_used") ||
                    "This name is already in use",
                async (value) =>
                    new Promise((resolve) => debouncedCheckName(resolve, value))
            );
    }, [user, userService]);

    const imageValidationSchema = useMemo(
        () =>
            yup
                .mixed()
                .optional()
                .test(
                    "fileSize",
                    "File too large",
                    (value: FileList) =>
                        !value.length ||
                        value[0].size <= PROFILE_MAX_FILE_SIZE_BYTES
                )
                .test(
                    "fileType",
                    "Unsupported file format",
                    (value: FileList) =>
                        !value.length ||
                        isSupportedFormat(value[0], SUPPORTED_IMAGE_MIME_TYPES)
                ),
        []
    );

    const optionalStringValidationSchema = useMemo(
        () =>
            yup
                .string()
                .trim()
                .transform((v) => v || null)
                .nullable(),
        []
    );

    const customUrlValidationSchema = useMemo(
        () =>
            optionalStringValidationSchema.matches(
                /^[a-zA-Z0-9]*$/,
                "Custom URL can contain only lowercase, uppercase and number characters"
            ),
        [optionalStringValidationSchema]
    );

    return {
        customUrlValidationSchema,
        imageValidationSchema,
        nameValidationSchema,
        optionalStringValidationSchema,
    };
}
