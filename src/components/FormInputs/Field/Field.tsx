import clsx from "clsx";
import React from "react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";

const { dark } = mixins;
const {
    colors: { red, neutrals },
    typography: { hairline2, captionBold1, caption2 },
    fonts: { Poppins },
} = variables;

export interface FieldProps {
    label?: string;
    description?: string | React.ReactNode;
    rightLabel?: string;
    labelInline?: boolean;
    className?: string;
    buttonIcon?: string;
    error?: string;
    readOnly?: boolean;
    inputStyle?: React.CSSProperties;
    [k: string]: any;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    function Field(
        {
            label,
            description,
            rightLabel,
            labelInline,
            children,
            className,
            error,
            readOnly,
            inputStyle,
            ...props
        },
        ref
    ) {
        return (
            <div {...{ className, ref }} {...props}>
                {label || rightLabel ? (
                    labelInline ? (
                        <LabelInlineContainer>
                            <LabelInlineText error={!!error}>
                                {label}
                            </LabelInlineText>
                        </LabelInlineContainer>
                    ) : (
                        <LabelContainer>
                            {label && (
                                <FieldLabel error={!!error}>{label}</FieldLabel>
                            )}

                            {rightLabel && (
                                <FieldRightLabel error={!!error}>
                                    {rightLabel}
                                </FieldRightLabel>
                            )}
                        </LabelContainer>
                    )
                ) : null}

                {description && (
                    <FieldDescription error={!!error}>
                        {description}
                    </FieldDescription>
                )}

                <FieldWrap
                    error={!!error}
                    readOnly={readOnly}
                    style={inputStyle}
                    className="field-wrap"
                >
                    {children}
                </FieldWrap>

                {error && <Error>{error}</Error>}
            </div>
        );
    }
);

const LabelContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
`;

const LabelInlineContainer = styled.div`
    position: relative;
    background-color: inherit;
    height: 0;
    width: 0;
`;

const LabelInlineText = styled.label<{ error?: boolean }>`
    position: absolute;
    width: max-content;
    transform: translate(16px, -50%);
    z-index: 1;
    padding-inline: 4px;
    line-height: 100%;
    color: ${({ error }) => (error ? red : neutrals[5])};
    background-color: ${neutrals[8]};
    ${caption2};
    font-weight: 500;

    ${dark`
        background-color: ${neutrals[1]};
    `};
`;

const FieldLabel = styled.div<{ error?: boolean }>`
    ${hairline2}
    color: ${({ error }) => (error ? red : neutrals[5])};
    transition: color 0.2s;
`;

const FieldDescription = styled.div<{ error?: boolean }>`
    ${caption2}
    color: ${({ error }) => (error ? red : neutrals[5])};
    transition: color 0.2s;
    margin-bottom: 12px;
`;

const FieldRightLabel = styled(FieldLabel)`
    margin-left: auto;
    text-transform: initial;
    color: ${({ error }) => (error ? red : neutrals[4])};

    ${dark`
        color: ${({ error }: any) => (error ? red : neutrals[7])};
    `}
`;

const FieldWrap = styled.div.attrs<{ error?: boolean; readOnly?: boolean }>(
    ({ error, readOnly }) => ({
        className: clsx({ error, readOnly }),
    })
)<{ error?: boolean; readOnly?: boolean }>`
    position: relative;

    width: 100%;
    background: none;
    ${Poppins}
    ${captionBold1}
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.2s, color 0.2s;

    min-height: 48px;
    display: flex;
    align-items: center;

    &:focus-within {
        border-color: ${({ theme }) => theme.colors.accent};
    }

    > * {
        &,
        &::placeholder {
            color: inherit;
        }
    }

    &.error {
        border-color: ${({ theme }) => theme.colors.error} !important;

        &,
        > input,
        > textarea {
            &,
            &::placeholder {
                border-color: ${({ theme }) =>
                    theme.colors.errorLight15} !important;
            }
        }
    }

    &.readOnly {
        background-color: ${({ theme }) => theme.colors.background};

        &,
        > input,
        > textarea {
            &,
            &::placeholder {
                color: ${({ theme }) => theme.colors.neutral} !important;
            }
        }
    }

    > input,
    > textarea {
        width: 100%;
        font: inherit;
        background: none;
        border: none;
        padding: none;

        &::placeholder {
            color: ${({ theme }) => theme.colors.neutral};
        }
    }
`;

const Error = styled.small`
    margin-top: 4px;
    color: ${red};
`;
