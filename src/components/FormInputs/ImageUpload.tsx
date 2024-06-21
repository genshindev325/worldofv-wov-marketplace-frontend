import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import isSupportedFormat from "../../utils/isSupportedFormat";
import { Button } from "../common/Button";
import Icon from "../Icon";
import { FormInputProps } from "./Form";

const { media, dark } = mixins;
const {
    colors: { neutrals, red },
    typography: { bodyBold2, caption2 },
} = variables;

interface ImageUploadProps extends FormInputProps {
    label?: string;
    description?: string | JSX.Element;
    imageSrc?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    description,
    imageSrc,
    watch,
    register,
    errors,
    inputProps,
}) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register
        ? register(inputProps?.name!)
        : { ref: () => null };

    const error = errors && (errors[inputProps?.name!]?.message as string);

    const uploadedFiles = watch ? watch("image") : undefined;
    const uploadedImage = uploadedFiles?.length
        ? isSupportedFormat(
              uploadedFiles[0],
              inputProps?.accept?.split(",") || ["*"]
          )
            ? URL.createObjectURL(uploadedFiles[0])
            : undefined
        : undefined;

    const imgSrc = uploadedImage || imageSrc;

    return (
        <Container>
            <ImageWrapper {...{ imageUploaded: !!imgSrc }}>
                {imgSrc ? (
                    <img src={imgSrc} alt="Avatar" />
                ) : (
                    <Icon icon="upload-file" size={32} />
                )}
            </ImageWrapper>

            <InfoWrap>
                {label && <Title>{label}</Title>}

                {description && <Description>{description}</Description>}
                {error && <Error>{error}</Error>}

                <InputWrapper>
                    <Button
                        outline
                        small
                        error={!!error}
                        onClick={() => inputRef.current?.click()}
                    >
                        Upload
                    </Button>

                    <input
                        type="file"
                        {...inputProps}
                        {...rest}
                        ref={(r) => {
                            ref(r);
                            inputRef.current = r;
                        }}
                    />
                </InputWrapper>
            </InfoWrap>
        </Container>
    );
};

const Container = styled.div`
    display: flex;

    ${media.d`
        max-width: 416px;
    `}
`;

const ImageWrapper = styled.div<{ imageUploaded?: boolean }>`
    position: relative;
    flex-shrink: 0;
    width: 128px;
    height: 128px;
    margin-right: 32px;
    border-radius: 50%;
    border: ${({ imageUploaded }) =>
        !imageUploaded && `2px dashed ${neutrals[6]}`};
    display: flex;
    align-items: center;
    justify-content: center;

    ${media.m`
        width: 64px;
        height: 64px;
        margin-right: 16px;
    `}

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .icon {
        width: 36px;
        height: 36px;
        font-size: 36px;
        color: ${neutrals[5]};
        margin: 0 auto;

        ${media.m`
            width: 24px;
            height: 24px;
            font-size: 24px;
        `}

        ${dark`
            color: ${neutrals[4]};
        `}
    }

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const InfoWrap = styled.div`
    flex-grow: 1;
`;

const Title = styled.div`
    margin-bottom: 8px;
    ${bodyBold2}
`;

const Description = styled.div`
    ${caption2};
    color: ${neutrals[4]};
`;

const Error = styled.div`
    margin-top: 4px;
    ${caption2};
    color: ${red};
`;

const InputWrapper = styled.div`
    display: inline-block;
    position: relative;
    margin-top: 16px;

    > input {
        display: none;
        pointer-events: none;
    }
`;

export default ImageUpload;
