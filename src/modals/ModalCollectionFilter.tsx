import { Flex } from "@/components/common/Flex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import Accordion from "../components/Accordion/Accordion";
import AccordionItem from "../components/Accordion/AccordionItem";
import { Button } from "../components/common/Button";
import { Input } from "../components/FormInputs/Input";
import { Select } from "../components/FormInputs/Select";
import Icon from "../components/Icon";
import { TokenAttributesFragment } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { SaleCurrency } from "../types/Currencies";
import AnimatedModal from "./AnimatedModal";

const { media, dark } = mixins;

const {
    colors: { neutrals, blue },
    typography,
    breakpoints,
} = variables;

const CURRENCY_OPTIONS: { label: string; value: SaleCurrency }[] = [
    { label: "VET", value: "VET" },
    { label: "WoV", value: "WoV" },
];

const UINT_VALIDATION_SCHEMA = yup
    .number()
    .typeError("Not a number")
    .positive("Must be > 0")
    .nullable()
    .transform((n, o) => (o ? n : null));

const VALIDATION_SCHEMA = yup.object({
    currency: yup.string().when(["minPrice", "maxPrice"], {
        is: (minPrice?: number, maxPrice?: number) => minPrice || maxPrice,
        then: yup.string().typeError("Required"),
        otherwise: yup.string().nullable(),
    }),

    minPrice: UINT_VALIDATION_SCHEMA,
    maxPrice: UINT_VALIDATION_SCHEMA.moreThan(yup.ref("minPrice")),

    minRank: UINT_VALIDATION_SCHEMA,
    maxRank: UINT_VALIDATION_SCHEMA.moreThan(yup.ref("minRank")),
});

export interface FormValues {
    selectedProperties?: TokenAttributesFragment[] | null;

    currency: string | null;
    minPrice: number | null;
    maxPrice: number | null;

    minRank: number | null;
    maxRank: number | null;
}

interface ModalCollectionFilterProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    attributes?: TokenAttributesFragment[] | null | undefined;
    values: FormValues;
    onSetValues?: (values: FormValues) => void;
}

const ModalCollectionFilter: React.FC<ModalCollectionFilterProps> = (props) => {
    return (
        <AnimatedModal title="Filter" {...props}>
            <ModalContent {...props} />
        </AnimatedModal>
    );
};

function ModalContent({
    setIsOpen,
    attributes,
    values,
    onSetValues,
}: ModalCollectionFilterProps) {
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue,
    } = useForm<FormValues>({
        defaultValues: values,
        resolver: yupResolver(VALIDATION_SCHEMA),
        reValidateMode: "onChange",
    });

    const [selectedProperties, setProperties] = React.useState<any>(
        values.selectedProperties
    );

    const toggleProperty = (key: string, value: string) => {
        const prevProps: any = { ...selectedProperties };

        if (!prevProps[key]) {
            prevProps[key] = [];
        }

        if (prevProps[key].indexOf(value) !== -1) {
            prevProps[key] = prevProps[key].filter(
                (el: string) => el !== value
            );

            if (prevProps[key].length === 0) {
                delete prevProps[key];
            }
        } else {
            prevProps[key].push(value);
        }

        setProperties(() => ({ ...prevProps }));
    };

    const isActive = React.useCallback(
        (key: string, value: string) =>
            selectedProperties?.hasOwnProperty(key)
                ? selectedProperties[key].indexOf(value) !== -1
                : false,
        [selectedProperties]
    );

    const getActiveProperties = (key: string) =>
        selectedProperties?.hasOwnProperty(key)
            ? selectedProperties[key].join(", ")
            : undefined;

    const onClear = async () => {
        setValue("selectedProperties", null);
        setValue("currency", null);
        setValue("minPrice", null);
        setValue("maxPrice", null);
        setValue("minRank", null);
        setValue("maxRank", null);
        setProperties(undefined);
    };

    const onSubmit = (values: FormValues) => {
        onSetValues?.({ ...values, selectedProperties });
        setIsOpen(false);
    };

    const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.a})`);

    const currencySelect = (
        <Controller
            name="currency"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
                <StyledSelect
                    isSmallScreen={isSmallScreen}
                    errors={errors}
                    label="Currency"
                    labelInline
                    inputProps={{
                        isClearable: true,
                        options: CURRENCY_OPTIONS,
                        ...field,
                        onChange: (o: any) => onChange(o?.value || null),
                        value: _.find(CURRENCY_OPTIONS, { value }) || null,
                    }}
                />
            )}
        />
    );

    return (
        <form>
            <Flex flexDirection="column" columnGap={3}>
                <MainAccordion defaultOpen="Price">
                    <MainAccordionItem key="price" title="Price">
                        <AccordionItemBody>
                            {isSmallScreen && currencySelect}

                            <RangeInputContainer>
                                {!isSmallScreen && currencySelect}
                                <Input
                                    errors={errors}
                                    inputProps={{
                                        placeholder: "Min",
                                        ...register("minPrice"),
                                    }}
                                />
                                <RangeInputSeparator>to</RangeInputSeparator>
                                <Input
                                    errors={errors}
                                    inputProps={{
                                        placeholder: "Max",
                                        ...register("maxPrice"),
                                    }}
                                />
                            </RangeInputContainer>
                        </AccordionItemBody>
                    </MainAccordionItem>
                </MainAccordion>

                <MainAccordion defaultOpen="Rarity">
                    <MainAccordionItem key="rarity" title="Rarity">
                        <AccordionItemBody>
                            <RangeInputContainer>
                                <Input
                                    errors={errors}
                                    inputProps={{
                                        placeholder: "Min",
                                        ...register("minRank"),
                                    }}
                                />
                                <RangeInputSeparator>to</RangeInputSeparator>
                                <Input
                                    errors={errors}
                                    inputProps={{
                                        placeholder: "Max",
                                        ...register("maxRank"),
                                    }}
                                />
                            </RangeInputContainer>
                        </AccordionItemBody>
                    </MainAccordionItem>
                </MainAccordion>

                {attributes?.length ? (
                    <>
                        <MainAccordion defaultOpen="Properties">
                            <MainAccordionItem
                                key="properties"
                                title="Properties"
                            >
                                <AccordionItemBody>
                                    <StyledAccordion>
                                        {attributes.map(({ key, values }) => (
                                            <StyledAccordionItem
                                                key={key}
                                                title={key}
                                                description={getActiveProperties(
                                                    key
                                                )}
                                            >
                                                <AccordionItemContent
                                                    values={values}
                                                    isActive={(v) =>
                                                        isActive(key, v)
                                                    }
                                                    toggleProperty={(v) =>
                                                        toggleProperty(key, v)
                                                    }
                                                />
                                            </StyledAccordionItem>
                                        ))}
                                    </StyledAccordion>
                                </AccordionItemBody>
                            </MainAccordionItem>
                        </MainAccordion>
                    </>
                ) : (
                    <div>No properties found for this collection</div>
                )}
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    rowGap={3}
                    position="sticky"
                    bottom={0}
                    py={3}
                    backgroundColor="background"
                >
                    <Button outline fullWidth onClick={onClear}>
                        Clear
                    </Button>
                    <Button fullWidth onClick={handleSubmit(onSubmit)}>
                        Apply
                    </Button>
                </Flex>
            </Flex>
        </form>
    );
}

interface AccordionItemContentProps {
    values: { value: string; count: number }[];
    isActive: (value: string) => boolean;
    toggleProperty: (value: string) => void;
}

function AccordionItemContent({
    values,
    isActive,
    toggleProperty,
}: AccordionItemContentProps) {
    return (
        <AccordionItemBody>
            {values.map(({ value, count }) => (
                <ItemWrapper
                    key={value}
                    isActive={isActive(value)}
                    onClick={() => toggleProperty(value)}
                >
                    <ItemLabel>{value}</ItemLabel>
                    <ItemRightContainer>
                        <ItemCount>{count}</ItemCount>
                        <Icon icon="check" color={blue} size={12} />
                    </ItemRightContainer>
                </ItemWrapper>
            ))}
        </AccordionItemBody>
    );
}

const MainAccordion = styled(Accordion)`
    margin-top: 0 !important;
    margin-bottom: 0;

    & > :last-child {
        border-bottom: 0;
    }
`;

const MainAccordionItem = styled(AccordionItem)`
    margin-top: 0;

    > div {
        overflow: unset !important;

        > div {
            ${typography.body2};
        }
    }
`;

const StyledAccordionItem = styled(AccordionItem)`
    > div[class*="AccordionHead"] {
        &:before {
            transform: translateY(-50%) !important;
        }
    }
`;

const StyledAccordion = styled(Accordion)`
    //margin-top: -32px;
    margin-top: -10px;
    margin-bottom: 0;

    & > :last-child {
        border-bottom: 0;
    }
`;

const AccordionItemBody = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledSelect = styled(Select)<{ isSmallScreen: boolean }>`
    margin-right: ${(props) => (props.isSmallScreen ? null : "8px")};
    margin-bottom: ${(props) => (props.isSmallScreen ? "8px" : null)};
`;

const ItemWrapper = styled.div<{ isActive: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 12px;
    border-radius: 6px;
    transition: all 0.12s ease-in-out 0s;

    &:hover {
        background-color: ${neutrals[8]};

        ${dark`
            background-color: ${neutrals[2]};
        `}
    }

    .icon {
        opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    }
`;

const ItemLabel = styled.div`
    ${typography.captionBold1};
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[7]};
    `};
`;

const ItemRightContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
        transition: all 0.12s ease-in-out 0s;
        margin-left: 16px;
    }
`;

const ItemCount = styled.div`
    ${typography.captionBold1};
`;

const RangeInputContainer = styled.div`
    display: flex;
    align-items: flex-start;

    > * {
        flex: 1;
    }
`;

const RangeInputSeparator = styled.p`
    ${typography.caption1};
    height: 48px;
    line-height: 48px;
    vertical-align: center;
    pointer-events: none;
    margin: 0 8px;
    flex: none;
`;

export default ModalCollectionFilter;
