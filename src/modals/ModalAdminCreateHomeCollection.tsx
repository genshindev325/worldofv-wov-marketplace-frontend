import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import moment, { HTML5_FMT } from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import { Input } from "../components/FormInputs/Input";
import { Select } from "../components/FormInputs/Select";
import {
    HomeCollectionFragment,
    UsersVerifiedStatus,
} from "../generated/graphql";
import AnimatedModal from "./AnimatedModal";

const VERIFIED_LVL_OPTIONS = [
    { label: "Not Verified", value: UsersVerifiedStatus.NotVerified },
    { label: "Verified", value: UsersVerifiedStatus.Verified },
    { label: "Curated", value: UsersVerifiedStatus.Curated },
];

const VALIDATION_SCHEMA = yup.object({
    title: yup.string().required(),
    position: yup.number().positive(),
    startsAt: yup.string().required(),

    bannerImageUrl: yup.string().url().required(),
    bannerLinkUrl: yup.string().url().required(),

    avatarImageUrl: yup
        .string()
        .url()
        .nullable()
        .transform((v) => (v === "" ? null : v)),

    avatarLinkUrl: yup
        .string()
        .url()
        .nullable()
        .transform((v) => (v === "" ? null : v)),

    avatarName: yup
        .string()
        .nullable()
        .transform((v) => (v === "" ? null : v)),
});

interface ModalAdminCreateHomeCollectionProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: HomeCollectionFragment) => Promise<any>;
    defaultValues?: HomeCollectionFragment;
}

export default function ModalAdminCreateHomeCollection(
    props: ModalAdminCreateHomeCollectionProps
) {
    const { isOpen, setIsOpen, defaultValues } = props;

    return (
        <AnimatedModal
            small
            title={defaultValues ? "Edit Collection" : "Create Collection"}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <ModalContent {...props} />
        </AnimatedModal>
    );
}

function ModalContent({
    onSubmit,
    defaultValues,
}: ModalAdminCreateHomeCollectionProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<HomeCollectionFragment>({
        defaultValues: { position: 1, ...defaultValues },
        resolver: yupResolver(VALIDATION_SCHEMA),
        reValidateMode: "onChange",
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="Title"
                errors={errors}
                inputProps={{
                    ...register("title"),
                    placeholder: "e.g. Ukiyoe Yōkai",
                }}
            />

            <Input
                label="Position"
                errors={errors}
                inputProps={{ ...register("position") }}
            />

            <Controller
                control={control}
                name="startsAt"
                render={({ field: { value, onChange, ...field } }) => (
                    <Input
                        label="Date &amp; Time"
                        errors={errors}
                        inputProps={{
                            type: "datetime-local",
                            ...field,
                            onChange: (o) => {
                                const value = moment(o.target.value);
                                onChange(value.toISOString());
                            },
                            value: value
                                ? moment(value).format(HTML5_FMT.DATETIME_LOCAL)
                                : "",
                        }}
                    />
                )}
            />

            <Input
                label="Background Image URL"
                errors={errors}
                inputProps={{ ...register("bannerImageUrl") }}
            />

            <Input
                label="Background Image Link"
                errors={errors}
                inputProps={{ ...register("bannerLinkUrl") }}
            />

            <Input
                label="Avatar Image URL"
                errors={errors}
                inputProps={{ ...register("avatarImageUrl") }}
            />

            <Input
                label="Avatar Image Link"
                errors={errors}
                inputProps={{ ...register("avatarLinkUrl") }}
            />

            <Input
                label="Avatar Name"
                errors={errors}
                inputProps={{ ...register("avatarName") }}
            />

            <Controller
                control={control}
                name="avatarVerifiedLevel"
                render={({ field: { value, onChange, ...field } }) => (
                    <Select
                        label="Verified Level"
                        errors={errors}
                        inputProps={{
                            ...field,
                            options: VERIFIED_LVL_OPTIONS,
                            onChange: (o: any) => onChange(o.value),
                            value: _.find(VERIFIED_LVL_OPTIONS, { value }),
                            menuPlacement: "top",
                        }}
                    />
                )}
            />

            <Button
                type="submit"
                style={{ width: "100%" }}
                loader={isSubmitting}
            >
                Confirm
            </Button>
        </Form>
    );
}

const Form = styled.form`
    display: flex;
    flex-direction: column;

    > * + * {
        margin-top: 20px;
    }
`;
