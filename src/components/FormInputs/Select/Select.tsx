import clsx from "clsx";
import _ from "lodash";
import dynamic from "next/dynamic";
import { lighten, rgba } from "polished";
import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import ReactSelect, {
    MultiValueGenericProps,
    Props as ReactSelectProps,
} from "react-select";
import styled, { createGlobalStyle } from "styled-components";
import iconArrowDownDark from "../../../assets/arrow-down-dark.svg";
import iconArrowDownLight from "../../../assets/arrow-down-light.svg";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import { Field } from "../Field";
import { FormInputProps } from "../Form";

const { dark } = mixins;
const {
    colors: { neutrals, blue, red },
} = variables;

export interface OptionItemProps<T = any> {
    label: string;
    value: T;
}

export interface SelectProps extends FormInputProps {
    label?: string;
    labelInline?: boolean;
    inputProps?: ReactSelectProps<any>;
    className?: string;
}

const MultiValueContainer = ({
    selectProps,
    data,
}: MultiValueGenericProps<any>) => {
    const values = selectProps.value;

    if (values) {
        return values[values.length - 1].label === data.label
            ? data.label
            : data.label + ", ";
    } else return "";
};

const SelectInput = forwardRef<any, any>(function SelectInput(
    { errors, inputProps, ...field },
    ref
) {
    return (
        <>
            <MenuStyle />
            <FieldSelect
                ref={ref}
                classNamePrefix="react-select"
                className={clsx("select", {
                    error: !!_.get(errors, inputProps.name!)?.message,
                })}
                hideSelectedOptions={false}
                {...inputProps}
                components={{ MultiValueContainer, ...inputProps.components }}
                {...field}
            />
        </>
    );
});

const Select_: React.FC<SelectProps> = ({
    label,
    labelInline,
    errors,
    inputProps,
    control,
    className,
    children,
}) => (
    <Field
        {...{ label, labelInline }}
        error={errors && errors[inputProps?.name!]?.message}
        inputStyle={{ padding: 0, border: 0 }}
        className={className}
    >
        {control ? (
            <Controller
                name={inputProps?.name!}
                control={control}
                render={({ field }) => (
                    <SelectInput {...field} {...{ errors, inputProps }} />
                )}
            />
        ) : (
            <SelectInput {...{ errors, inputProps }} />
        )}

        {children}
    </Field>
);

const FieldSelect = styled(ReactSelect)`
    width: 100%;

    .react-select {
        &__control {
            cursor: pointer;
            float: none;
            width: 100%;
            height: 48px;
            box-shadow: inset 0 0 0 2px ${neutrals[6]};
            background: ${neutrals[8]};
            border-radius: ${({ theme }) => theme.radii[3]}px;
            border: none;
            opacity: 1;
            font-size: 14px;
            font-weight: 500;
            line-height: 48px;
            transition: box-shadow 0.2s, color 0.2s;

            ${({ isDisabled }) =>
                !isDisabled &&
                `
                &::before {
                content: "";
                position: absolute;
                top: 50%;
                right: 8px;
                width: 32px;
                height: 32px;
                transform: translateY(-50%);
                border-radius: 50%;
                box-shadow: inset 0 0 0 2px ${neutrals[6]};
                background: url("${iconArrowDownLight.src}") no-repeat 50% 50% /
                    10px auto;
                transition: transform 0.2s;
            }
            `}

            &--is-focused,
            &--menu-is-open {
                box-shadow: inset 0 0 0 2px ${neutrals[4]};
            }

            &--menu-is-open {
                &::before {
                    transform: translateY(-50%) rotate(-180deg);
                }
            }

            ${dark`
                background: ${neutrals[1]};
                box-shadow: inset 0 0 0 2px ${neutrals[3]};
                -webkit-appearance: none;

                &::before {
                    box-shadow: inset 0 0 0 2px ${neutrals[3]};
                    background-image: url("${iconArrowDownDark.src}");
                }
            `}
        }

        &__placeholder {
            color: ${neutrals[4]};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__value-container {
            margin: 0 48px 0 14px;
            height: 48px;
            overflow: hidden;

            &--is-multi {
                display: inline-flex;
                justify-content: flex-end;
                flex-wrap: nowrap;
            }
        }

        &__single-value,
        &__input-container {
            line-height: 48px;
            padding: 0;
            margin: 0;
            color: ${neutrals[3]};

            ${dark`
                color: ${neutrals[8]};
            `}
        }

        &__dropdown-indicator,
        &__indicator-separator {
            visibility: hidden;
        }

        &__multi-value {
            line-height: initial;
        }
    }

    &.error {
        .react-select {
            &__control {
                & {
                    box-shadow: 0 0 0 2px inset ${red} !important;
                }
            }

            &__placeholder,
            &__single-value {
                color: ${lighten(0.15, red)} !important;
            }
        }
    }
`;

/**
 * We need to use global styles for the menu and option components, otherwise
 * the styles will not applied if they are rendered in a portal.
 *
 * The body selector is just a trick to increase specificity, otherwise the
 * styles would be overridden by the default classes.
 */
const MenuStyle = createGlobalStyle`
    body .react-select__menu {
        right: 0;
        margin-top: 2px;
        border-radius: ${({ theme }) => theme.radii[3]}px;
        background: ${neutrals[8]};
        border: 2px solid ${neutrals[6]};
        box-shadow: 0 4px 12px ${rgba(neutrals[2], 0.1)};
        overflow: hidden;
        z-index: 10;

        ${dark`
            background: ${neutrals[1]};
            border-color: ${neutrals[3]};
            box-shadow: 0 4px 12px ${rgba(neutrals[1], 0.1)};
        `}

        &-list {
            margin: 0;
            padding: 0;
        }
    }

    body .react-select__option {
        cursor: pointer;
        min-height: auto;
        padding: 10px 14px;
        font-weight: 500;
        line-height: 1.4;
        white-space: nowrap;
        overflow:hidden;
        text-overflow: ellipsis;

        &:hover,
        &--is-focused {
            background: ${neutrals[7]};

            ${dark`
                background: ${neutrals[2]};
            `}
        }

        &--is-selected {
            font-weight: 500;
            color: ${blue};
            background: transparent;
        }
    }
`;

export const Select = dynamic(() => Promise.resolve(Select_), { ssr: false });
