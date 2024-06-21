import ReactSlider, { SliderProps as ReactSliderProps } from "rc-slider";
import React from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { Field } from "./Field";
import { FormInputProps } from "./Form";

const { dark } = mixins;
const {
    colors: { blue, neutrals },
} = variables;

interface SliderProps extends FormInputProps {
    label?: string;
    prefix?: string;
    suffix?: string;
    inputProps: ReactSliderProps & { name: string };
}

const Slider: React.FC<SliderProps> = ({
    label,
    prefix,
    suffix,
    errors,
    control,
    inputProps,
}) => (
    <Field
        {...{ label }}
        error={errors && errors[inputProps?.name!]?.message}
        inputStyle={{ padding: 0, border: 0, flexDirection: "column" }}
    >
        <Controller
            name={inputProps?.name!}
            control={control}
            render={({ field: { onChange } }) => (
                <>
                    <StyledSlider
                        {...inputProps}
                        {...{ onChange }}
                        {...(prefix || suffix
                            ? {
                                  tipFormatter: (v) =>
                                      `${prefix || ""}${v}${suffix || ""}`,
                              }
                            : {})}
                    />

                    <Indicators>
                        <IndicatorText>
                            {prefix}
                            {inputProps.min || 0}
                            {suffix}
                        </IndicatorText>

                        <IndicatorText>
                            {prefix}
                            {inputProps.max || 100}
                            {suffix}
                        </IndicatorText>
                    </Indicators>
                </>
            )}
        />
    </Field>
);

const ReactSliderWithTooltip = ReactSlider.createSliderWithTooltip(ReactSlider);

const StyledSlider = styled(ReactSliderWithTooltip)`
    .rc-slider {
        &-rail,
        &-track {
            height: 8px;
        }

        &-rail {
            background: ${neutrals[6]};

            ${dark`
                background: ${neutrals[3]};
            `}
        }

        &-track {
            background: ${blue};
        }

        &-handle {
            cursor: pointer;
            box-shadow: none;
            width: 24px;
            height: 24px;
            background: ${blue};
            border: 4px solid ${neutrals[8]};
            margin-top: -8px;
            right: -12px;
        }

        &-tooltip {
            &-inner {
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 40px;
                padding: 4px 8px;
                background: ${neutrals[1]};
                border-radius: 8px;
                border: none;
                box-shadow: none;
                font-size: 14px;
                font-weight: 600;
                color: ${neutrals[8]};

                &:before {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                }

                ${dark`
                    background: ${neutrals[3]};
                `}
            }

            &-arrow {
                border-top-color: ${neutrals[8]};

                ${dark`
                    border-top-color: ${neutrals[3]};
                `}
            }
        }
    }
`;

const Indicators = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 8px;
`;

const IndicatorText = styled.div`
    font-weight: 500;
`;

export default Slider;
