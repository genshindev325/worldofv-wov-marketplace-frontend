import { GraphQLService } from "@/services/GraphQLService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useMemo } from "react";
import {
    Control,
    Controller,
    useForm,
    UseFormRegister,
    useFormState,
} from "react-hook-form";
import { BsLightningChargeFill } from "react-icons/bs";
import styled from "styled-components";
import * as yup from "yup";
import CATEGORIES from "../../constants/categories";
import ModalTextArea from "../../modals/ModalTextArea";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";
import { TokenAsset } from "../common/TokenAsset";
import { Input } from "../FormInputs/Input";
import { Select } from "../FormInputs/Select";
import InfoPopup from "../InfoPopup";
import { BatchCreateContext, TokenInfo } from "./BatchCreateContext";

const { media, dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

const NAME_VALIDATION_SCHEMA = yup
    .string()
    .trim()
    .required("Required")
    .transform((n, o) => (o ? n : ""))
    .test("unused", async function (name = "") {
        try {
            const reponse = await GraphQLService.sdk().GetTokenExists({
                smartContractAddress:
                    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!,
                name,
            });
            if (reponse.exists) {
                return this.createError({ message: "Already used" });
            } else {
                return true;
            }
        } catch {
            return this.createError({ message: "Server Error" });
        }
    });

const DESCRIPTION_VALIDATION_SCHEMA = yup
    .string()
    .trim()
    .transform((n, o) => (o ? n : ""));

const ROYALTY_VALIDATION_SCHEMA = yup
    .number()
    .min(0, "Must be >= 0%")
    .max(25, "Must be <= 25%")
    .nullable()
    .transform((n, o) => (o ? n : 0));

const VALIDATION_SCHEMA = yup.object({
    tokens: yup
        .array()
        .of(
            yup.object({
                name: NAME_VALIDATION_SCHEMA,
                description: DESCRIPTION_VALIDATION_SCHEMA,
                royaltyPercent: ROYALTY_VALIDATION_SCHEMA,
            })
        )
        .test({
            name: "unique",
            message: "Name must be unique",
            test: (list) => {
                const values = list?.map((m) => m.name).filter((n) => n);
                return !values || values.length === new Set(values).size;
            },
        }),
});

interface FieldValues {
    tokens: TokenInfo[];
}

export default function BatchCreateTable() {
    const { tokens, replaceTokens, increaseStep } =
        useContext(BatchCreateContext);

    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        clearErrors,
    } = useForm<FieldValues>({
        defaultValues: { tokens },
        resolver: yupResolver(VALIDATION_SCHEMA),
        reValidateMode: "onBlur",
    });

    const { errors, isSubmitting } = useFormState({
        control,
        name: `tokens`,
        exact: true,
    });

    // Persist the form values in the global state before unmounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => replaceTokens(getValues("tokens")), []);

    const onSubmit = (data: FieldValues) => {
        replaceTokens(data.tokens);
        increaseStep();
    };

    const onAutofill = (property: keyof TokenInfo) => {
        clearErrors();

        let values = getValues(`tokens`);

        if (values.every((t) => t[property])) {
            const [head, ...tail] = values.slice(0);
            values = [head, ...tail.map((t) => ({ ...t, [property]: null }))];
        } else if (!values?.[0][property]) {
            return;
        } else if (property === "name") {
            const data = values[0].name?.match(/^\s*(.+?)\s*(?:#(\d*))?\s*$/);
            const name = data?.[1] || "";
            const initial = parseInt(data?.[2] || "1");
            const mapper = (index: number) => `${name} #${initial + index}`;
            values = values.map((t, i) => ({ ...t, name: mapper(i) }));
        } else {
            values = values.map((t) => ({
                ...t,
                [property]: t[property] || values[0][property],
            }));
        }

        for (let index = 0; index < tokens.length; index++) {
            setValue(`tokens.${index}.${property}`, values[index][property]);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TableContainer>
                <Table>
                    <thead>
                        <Row>
                            <TableHeader></TableHeader>
                            <TableHeader>
                                Name
                                <NameAutofillInfo />
                                <AutofillIcon
                                    onClick={() => onAutofill("name")}
                                />
                            </TableHeader>
                            <TableHeader>
                                Description
                                <AutofillInfo />
                                <AutofillIcon
                                    onClick={() => onAutofill("description")}
                                />
                            </TableHeader>
                            <TableHeader>
                                Royalty
                                <AutofillInfo />
                                <AutofillIcon
                                    onClick={() => onAutofill("royaltyPercent")}
                                />
                            </TableHeader>
                            <TableHeader>
                                Categories
                                <AutofillInfo />
                                <AutofillIcon
                                    onClick={() => onAutofill("categories")}
                                />
                            </TableHeader>
                        </Row>
                    </thead>
                    <tbody>
                        {tokens.map((token, index) => (
                            <Item
                                key={index}
                                control={control}
                                register={register}
                                token={token}
                                index={index}
                            />
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
            <Button type="submit" loader={isSubmitting}>
                Next
            </Button>
            <ErrorMessage>{(errors?.tokens as any)?.message}</ErrorMessage>
        </Form>
    );
}

interface ItemProps {
    control: Control<FieldValues>;
    register: UseFormRegister<FieldValues>;
    token: TokenInfo;
    index: number;
}

function Item({ control, register, token, index }: ItemProps) {
    const src = useMemo(() => URL.createObjectURL(token.file), [token.file]);
    const { errors } = useFormState({ control, name: `tokens.${index}` });

    return (
        <Row>
            <Cell>
                <TokenAsset
                    asset={{ url: src, mimeType: token.file.type }}
                    sizePx={96}
                />
            </Cell>
            <Cell>
                <Input
                    errors={errors}
                    inputProps={{
                        ...register(`tokens.${index}.name`),
                    }}
                />
                <Filename>Filename: {token.file.name}</Filename>
            </Cell>
            <Cell>
                <Controller
                    control={control}
                    name={`tokens.${index}.description`}
                    render={({ field }) => (
                        <ModalTextArea
                            errors={errors}
                            title="Description"
                            inputProps={{
                                ...field,
                                value: field.value ?? undefined,
                            }}
                        />
                    )}
                />
            </Cell>
            <Cell>
                <Input
                    errors={errors}
                    rightDecoration={<InputDecoration>%</InputDecoration>}
                    inputProps={{
                        placeholder: "0",
                        ...register(`tokens.${index}.royaltyPercent`),
                    }}
                />
            </Cell>
            <Cell>
                <Select
                    control={control}
                    errors={errors}
                    inputProps={{
                        name: `tokens.${index}.categories`,
                        options: CATEGORIES,
                        isMulti: true,
                        menuPortalTarget: document.body,
                    }}
                />
            </Cell>
        </Row>
    );
}

function NameAutofillInfo() {
    return (
        <InfoPopup>
            Click the bolt icon (<BsLightningChargeFill />) to fill the rows
            with the name in the first column. All names will be numbered
            sequentially. If you would like to start from a higher number you
            can specify the starting value in the first column. Click again to
            reset the column.
        </InfoPopup>
    );
}

function AutofillInfo() {
    return (
        <InfoPopup>
            Click the bolt icon (<BsLightningChargeFill />) to copy the first
            row information to all rows. Click again to reset the column.
        </InfoPopup>
    );
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding-bottom: 16px;
`;

const TableContainer = styled.div`
    overflow: scroll;
`;

const Table = styled.table`
    border-spacing: 16px;
    border-collapse: separate;
    white-space: nowrap;
`;

const TableHeader = styled.th`
    ${typography.hairline1}
    color: ${neutrals[3]};
    text-align: left;

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const Cell = styled.td<{ centered?: boolean }>`
    position: relative;
    ${typography.body2}
    vertical-align: top;
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[6]};
    `}
`;

const Row = styled.tr`
    td {
        :nth-child(1) {
            width: fit-content;
        }
        :nth-child(2) {
            min-width: 128px;
            max-width: 160px;
        }
        :nth-child(3) {
            min-width: 160px;
            max-width: 192px;
        }
        :nth-child(4) {
            min-width: 128px;
            max-width: 128px;
        }
        :nth-child(5) {
            min-width: 192px;
            max-width: 256px;
        }
    }
`;

const InputDecoration = styled.span`
    color: ${neutrals[4]};
`;

const AutofillIcon = styled(BsLightningChargeFill)`
    margin-left: 4px;
    cursor: pointer;
    float: right;
`;

const ErrorMessage = styled.p`
    ${typography.caption1}
    color: ${colors.red};
`;

const Filename = styled.p`
    position: absolute;
    bottom: 0;
    left: 0;
    color: ${neutrals[4]};
    ${typography.caption2}
`;
