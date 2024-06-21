import { get } from "lodash";
import type { FieldErrors } from "react-hook-form";
import VerificationInputNative, {
    VerificationInputProps as VerificationInputNativeProps,
} from "react-verification-input";
import styled from "styled-components";
import { Field, FieldProps } from "../../FormInputs/Field";

export interface VerificationInputProps<T extends object = any>
    extends VerificationInputNativeProps,
        Pick<FieldProps, "label" | "description"> {
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    register: any; //UseFormRegister<T>;
    errors?: FieldErrors<T>;
}

export function VerificationInput({
    label,
    description,
    inputProps,
    register,
    errors,
    ...rest
}: VerificationInputProps) {
    if (inputProps.name == null) throw new Error("Input name is required");

    const inputName = inputProps.name;

    const { onChange, onBlur } = register(inputName);

    return (
        <Field
            label={label}
            description={description}
            error={get(errors, inputName)?.message}
        >
            <ClassDefs
                error={
                    get(errors, inputName)?.message != null
                        ? (get(errors, inputName)!.message! as string).length >
                          0
                        : false
                }
            >
                <VerificationInputNative
                    {...rest}
                    classNames={{
                        container: "container",
                        character: "character",
                        characterSelected: "character--selected",
                    }}
                    onChange={(value) => {
                        onChange({
                            target: { name: inputName, value },
                        });
                    }}
                    onBlur={() => {
                        onBlur({ target: {} });
                    }}
                    inputProps={{ name: inputName }}
                />
            </ClassDefs>
        </Field>
    );
}

const ClassDefs = styled.div<{ error: boolean }>`
    width: 100%;
    .vi__wrapper {
        width: 100%;
    }
    .container {
        height: 70px;
        width: 100%;
        display: flex;
        gap: ${({ theme }) => theme.space[1]}px;
        @media screen and (min-width: ${({ theme }) => theme.breakpoints.m}) {
            gap: ${({ theme }) => theme.space[3]}px;
        }
    }
    .character {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${({ theme }) => theme.radii[3]}px;
        border: 2px solid ${({ theme }) => theme.colors.muted};
        font-size: ${({ theme }) => theme.fontSizes[6]}px;
        border-color: ${({ theme, error }) =>
            theme.colors[error ? "errorLight15" : "muted"]};
        background-color: inherit;
        color: ${({ theme }) => theme.colors.text};
    }
    .character--selected {
        color: ${({ theme }) => theme.colors.text};
        border-color: ${({ theme }) => theme.colors.accent};
    }
`;
